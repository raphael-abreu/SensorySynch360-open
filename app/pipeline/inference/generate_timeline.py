from scipy.optimize import linear_sum_assignment
import numpy as np
import unittest
debug = False

def calculate_iou(bb1, bb2):
  half_width_bb1 = bb1['size']['width'] / 2
  half_height_bb1 = bb1['size']['height'] / 2
  half_width_bb2 = bb2['size']['width'] / 2
  half_height_bb2 = bb2['size']['height'] / 2

  # Calculate the center points of the bounding boxes
  center_lon_bb1 = bb1['centerPoint']['lon']
  center_lat_bb1 = bb1['centerPoint']['lat']
  center_lon_bb2 = bb2['centerPoint']['lon']
  center_lat_bb2 = bb2['centerPoint']['lat']
  if(debug):
    tl_bb1 = (center_lat_bb1+half_height_bb1,center_lon_bb1+half_width_bb1)
    br_bb1 = (center_lat_bb1-half_height_bb1,center_lon_bb1-half_width_bb1)
    tl_bb2 = (center_lat_bb2+half_height_bb2,center_lon_bb2+half_width_bb2)
    br_bb2 = (center_lat_bb2-half_height_bb2,center_lon_bb2-half_width_bb2)

    print("bb1 tl ",tl_bb1)
    print("bb1 br ",br_bb1)
    print("bb2 tl ",tl_bb2)
    print("bb2 br ",br_bb2)

  # Handle the -180 to 180 wrapping
  if abs(center_lon_bb1 - center_lon_bb2) > 180:
    if center_lon_bb1 > center_lon_bb2:
      center_lon_bb2 += 360
    else:
      center_lon_bb1 += 360

  # Before the area of union is computed, 
  # you must first find the smallest bounding box that contains 
  # both bb1 and bb2
  top_bb1 = center_lat_bb1 + half_height_bb1
  top_bb2 = center_lat_bb2 + half_height_bb2
  lat_topmost = min(top_bb1,top_bb2)

  bottom_bb1 = center_lat_bb1 - half_height_bb1
  bottom_bb2 = center_lat_bb2 - half_height_bb2
  lat_bottommost = max(bottom_bb1,bottom_bb2)
  
  # Our coordinate system is based 
  # on the point of view of the user, so the longitude
  # is inverted compared to the normal usage 
  left_bb1 = center_lon_bb1 + half_width_bb1
  left_bb2 = center_lon_bb2 + half_width_bb2
  lon_leftmost = min(left_bb1,left_bb2)

  right_bb1 = center_lon_bb1 - half_width_bb1
  right_bb2 = center_lon_bb2 - half_width_bb2
  lon_rightmost = max(right_bb1,right_bb2)


  intersect_width = max(0, lon_leftmost - lon_rightmost)
  intersect_height = max(0, lat_topmost - lat_bottommost)
  intersection_area = intersect_width * intersect_height
  # Now we must calculate how much the intersection area contributes to our union
  bb1_area = bb1['size']['width'] * bb1['size']['height']
  bb2_area = bb2['size']['width'] * bb2['size']['height']

  # Calculate union area
  union_area = bb1_area + bb2_area - intersection_area
    
  if(debug):
    print("Intersection top_left",lat_topmost,lon_leftmost)
    print("Intersection bottom_right",lat_bottommost,lon_rightmost)
    print("intersection_area",intersection_area)
    print("union_area",union_area)

  # Calculate IoU
  if intersection_area <= 0 :
    return 0
  iou = intersection_area / union_area
  return iou

def filter_objects_by_effect_type(obj_dict, effect_type,sourceTag = False):
    filtered_by_effect_type = {key: [] for key in obj_dict.keys()}
    for key, objects in obj_dict.items():
        for obj in objects:
              if obj.get('effectType') == effect_type:
                if sourceTag:
                    filtered_tag = obj.get('sourceTag')
                    if (filtered_tag == sourceTag):
                      filtered_by_effect_type[key].append(obj.copy())
                else:
                  filtered_by_effect_type[key].append(obj.copy())
    return filtered_by_effect_type

def build_g(present,future,effects):
  
  tam_present = len(effects[present])
  tam_future = len(effects[future])
  
  g = np.zeros(shape=(tam_present, tam_future))
  #this effects obj is separated by seconds thus present and future at the first level
  #the second level is the effect that we are acessgin
  #the thir level is the keyframe in that effect.
  #all effects created will have a keyframes list inside that has at least the starting second of that effect.
  #Thus we use also use present and future to acess those keyframes.
  for i in range(tam_present):
    for j in range(tam_future):
      g[i][j] = calculate_iou(effects[present][i]['keyframes'][present],effects[future][j]['keyframes'][future])
  return g

# this function decides wich effect in the future (col) is a match for every effect in present (row).
# also those rows and cols that had no association 
def solve_cost_matrix(g):
  treshold = 0.1
  cost_matrix = np.array(g)
  row_indices, col_indices = linear_sum_assignment(cost_matrix,maximize=True)

  # remove row,col if the association weight with col is > 0.1
  mask = g[row_indices, col_indices] > treshold
  row_indices = row_indices[mask]
  col_indices = col_indices[mask]

  all_rows = list(range(g.shape[0]))
  all_cols = list(range(g.shape[1]))
  
  unassociated_rows = list(set(all_rows) - set(row_indices))
  unassociated_cols = list(set(all_cols) - set(col_indices))
  return row_indices,col_indices,unassociated_rows,unassociated_cols

def add_initial_keyframes(object):
  modified_obj = object.copy()
  for seconds, obj_list in modified_obj.items():
    for obj in obj_list:
        keyframe = {}
        if 'centerPoint' in obj:
            keyframe['centerPoint'] = obj['centerPoint']
        if 'size' in obj:
            keyframe['size'] = obj['size']
        if 'intensity' in obj:
            keyframe['intensity'] = obj['intensity']
        if 'propagation' in obj:
            keyframe['propagation'] = obj['propagation']
        obj.setdefault('keyframes', {})[seconds] = keyframe
        obj.pop('centerPoint', None)
        obj.pop('size', None)
        obj.pop('intensity', None)
        obj.pop('propagation', None)
  return modified_obj

def generate_timeline(obj, effect):
  effects = filter_objects_by_effect_type(obj,effect,None)
  effects = add_initial_keyframes(effects)
  total_seconds = list(obj.keys())
  present = total_seconds.pop(0)
  future = total_seconds.pop(0)
  lastSecond = total_seconds[-1]
  outputList = []
  while(future):
    if(debug):
      print("Starting second ",present," to: ",future," until",lastSecond)

    has_effects = True if any(effects[present]) else False
    if(has_effects):
      
      g = build_g(present,future,effects)
      
      if(debug):
        print("G graph generated")

        print("\t",end="")
        rows,cols = np.shape(g)
        """ The graph is like this:
        It means that effect 0 on present is a 0.92 match with effect 0 on future
              F       U       T       U       R       E
              0       1       2       3       4       5
        P 0   0.992   0.000   0.031   0.000   0.408   0.000 
        R 1   0.000   0.919   0.000   0.000   0.000   0.000 
        E 2   0.030   0.000   0.924   0.000   0.000   0.000 
        S 3   ...
        E 4   ..
        N 5   .
        T 6
        """
        for j in range(cols):
          print(j,end="\t")
        print(" ")
        for i in range(rows):
            print(i,"\t",end="")
            for j in range(cols):
                print(f"{g[i][j]:.3f}",end="\t")
            print("")
      row_indices,col_indices,unassociated_rows,unassociated_cols = solve_cost_matrix(g)
     
      if(debug):
        for row, col in zip(row_indices, col_indices):
            print(f"Effect {row} is associated with effect {col} with value {g[row, col]}")
          
        if(unassociated_cols):
          print(unassociated_rows,"Effects on present dont have associations with future")
          for row in unassociated_rows:
            max_col = np.argmax(g[row])
            print(f"Present effect {row} does not have association. Max value in this row: {g[row, max_col]}")
      
        # Imprima as colunas não associadas
        for col in unassociated_cols:
            max_row = np.argmax(g[:, col])
            print(f"Future effect {col} does not have association. Max value in this col: {g[max_row, col]}")
    
      
      ## row and col represent the seconds that these keyframes are
      ## this is why we can use it to directly address the data inside the keyframes.
      # We know that the data is there because we looped trough it before
      ## Thus row and col represent the second in the loop and also the second inside the keyframes
    
      # row is the number of the effect obj in the present
      # col is the number of the effect obj in the future
    
      # this code takes the keyframes inside the row and places on the col
      #print("begin update")
      for row, col in zip(row_indices, col_indices):
        present_effect = effects[present][row]
        future_effect = effects[future][col]
        present_keyframes = present_effect['keyframes']
        future_keyframes = future_effect['keyframes']
        present_keyframes = present_effect.get('keyframes', {})
        if(debug):
          print("The effect",row,"in present is a match to effect",col,"in future")
          print("\tpresent:",tuple(present_keyframes[present]['centerPoint'].values()),tuple(present_keyframes[present]['size'].values()))
          print("\tfuture:",tuple(future_keyframes[future]['centerPoint'].values()),tuple(future_keyframes[future]['size'].values()))
        # to keep only the first identified kf.
        # This will avoid us to keep inserting intermediate keyframes all the time
        first_present_keyframe = {min(present_keyframes): present_keyframes[min(present_keyframes)]}      
        future_keyframes.update(first_present_keyframe)
        #OLD WAY -> future_keyframes.update(present_keyframes)
      for row in unassociated_rows:
        present_effect = effects[present][row]
        # Dirty bug-fix. If the effect has been identified only on one second, we add another keyframe. 
        # But if we are on the last second, just ignore this effect
        if(len(present_effect['keyframes']) == 1 and present == lastSecond):
            continue
        if(len(present_effect['keyframes']) == 1):
          newKey = future
          present_effect['keyframes'][newKey] = list(present_effect['keyframes'].values())[0]
        if(debug):
           print("added",present_effect)
        outputList.append(present_effect)
      
      # note that we dont need to do this with col because they will become rows in the next iteration
      ## if we are on the last one. add all the found rows
      if(future == lastSecond):
        #print("adding remaining effects")
        for row, col in zip(row_indices, col_indices):
          future_effect = effects[future][col]
          #print("added",future_effect)
          outputList.append(future_effect)
          
    present = future
    future = total_seconds.pop(0) if total_seconds else False
  return outputList

def generate_timeline_ambient(obj, effect, sourceTag):
  effects = filter_objects_by_effect_type(obj,effect,sourceTag = sourceTag)
  effects = add_initial_keyframes(effects)
  total_seconds = list(obj.keys())
  present = total_seconds.pop(0)
  future = total_seconds.pop(0)
  lastSecond = total_seconds[-1]
  outputList = []
  while(future):
    if(debug):
      print("Starting second ",present," to: ",future," until",lastSecond)
    present_effect = (effects[present][0] if effects[present] else None)
    future_effect = (effects[future][0] if effects[future] else None)

    if(present_effect and future_effect):
      present_keyframes = present_effect['keyframes']
      future_keyframes = future_effect['keyframes']
      first_present_keyframe = {min(present_keyframes): present_keyframes[min(present_keyframes)]}      
      future_keyframes.update(first_present_keyframe)

    elif(present_effect and not future_effect):
      if(len(present_effect['keyframes']) == 1):
        newKey = future
        present_effect['keyframes'][newKey] = list(present_effect['keyframes'].values())[0]
      if(debug):
          print("added",present_effect)
      outputList.append(present_effect)

    if(future == lastSecond):
      if(debug):
        print("adding remaining effects")
      if(future_effect):
        outputList.append(future_effect)
    present = future
    future = total_seconds.pop(0) if total_seconds else False
  return outputList


class TestIOU(unittest.TestCase):
    def test_calculate_iou_same(self):
        bb1 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 10}}
        bb2 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 10}}
        iou = calculate_iou(bb1, bb2)
        self.assertAlmostEqual(iou, 1)

    def test_calculate_iou_one_third(self):
        bb1 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 10}}
        bb2 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 0}}
        iou = calculate_iou(bb1, bb2)
        self.assertAlmostEqual(iou, 0.333333,places=4)

    def test_calculate_iou_none(self):
        bb1 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 10}}
        bb2 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': -10}}
        iou = calculate_iou(bb1, bb2)
        self.assertAlmostEqual(iou, 0,places=4)
        
    def test_calculate_iou_offset_lon_third(self):
        bb1 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': -175}}
        bb2 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 10,'lon': 175}}
        iou = calculate_iou(bb1, bb2)
        self.assertAlmostEqual(iou, 0.333333,places=4)

    def test_calculate_iou_offset_lat_third(self):
        bb1 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': -5,'lon': 10}}
        bb2 = {'size': {'height': 20,'width': 20}, 'centerPoint': {'lat': 5,'lon': 10}}
        iou = calculate_iou(bb1, bb2)
        self.assertAlmostEqual(iou, 0.333333,places=4)


class TestG(unittest.TestCase):
    def test_cost_matrix(self):
        cost = np.array([[0.972,0.000,0.000,0.000,0.406,0.000],
            [0.000,0.655,0.000,0.000,0.000,0.000],
            [0.000,0.000,1.000,0.000,0.000,0.000],
            [0.000,0.000,0.000,0.983,0.000,0.000],
            [0.000,0.000,0.000,0.219,0.000,0.000]])
        row_indices,col_indices,unassociated_rows,unassociated_cols = solve_cost_matrix(cost)
        self.assertIsNone(
            np.testing.assert_array_equal(row_indices,np.array((0,1,2,3)))
            )
        self.assertIsNone(
            np.testing.assert_array_equal(col_indices,np.array((0,1,2,3)))
            )
        self.assertIsNone(
            np.testing.assert_array_equal(unassociated_rows,np.array((4)))
            )
        self.assertIsNone(
            np.testing.assert_array_equal(unassociated_cols,np.array((4,5)))
            )

if __name__ == '__main__':
    unittest.main()

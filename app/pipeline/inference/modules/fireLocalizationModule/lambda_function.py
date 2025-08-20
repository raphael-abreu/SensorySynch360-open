import numpy as np
import py360convert # Biblioteca de conversão de equirect-cubemap https://github.com/sunset1995/py360convert
import cv2 as cv
import os,sys
import base64
# Get the current directory of the script
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add the parent directory to sys.path to enable relative imports
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from cubicObj_utils import *
from BaseRecognitionModule import BaseRecognitionModule

class FireLocalizationModule(BaseRecognitionModule):
    def __init__(self, module_name, media_input_type, depends_on=[]):
        super().__init__(module_name, media_input_type, depends_on=[])
        ##Fire detection 
        self.fire_classes = open('./fireLocalizationModule/fire/fire.names').read().strip().split('\n')
        self.fire_net = cv.dnn.readNetFromDarknet('./fireLocalizationModule/fire/yolov4-fire.cfg', './fireLocalizationModule/fire/yolov4-fire_best.weights')
        self.fire_ln = self.fire_net.getUnconnectedOutLayersNames()
    
    def pre_process(self, mediaList):
        return mediaList

    def inference(self,mediaList):
        ## Loading image
        print("running fire localization module")

        total_frames = len(mediaList)
        outputLabels = {}
        # Process each frame
        for second, frame in mediaList.items():
            second = int(second)
            outputLabels[second] = []
            print("starting second",second)

            self.send_partial_result((second/total_frames)*100)

            frame_bytes = base64.b64decode(frame) #TODO Use Blob as input instead
            image_array = np.frombuffer(frame_bytes, dtype=np.uint8)
            equirectImg = cv.imdecode(image_array, cv.IMREAD_COLOR)  # Decode as BGR image

            equirectH,equirectW = equirectImg.shape[0:2]

            ## Pre processing
            cubeFaceSize = 384
            cubicFaces=py360convert.e2c(equirectImg,face_w=cubeFaceSize,cube_format='dict')
            # flip
            cubicFaces['R'] = cubicFaces['R'][:,::-1] #np.flip(cubicFaces['R'],1)
            cubicFaces['B'] = cubicFaces['B'][:,::-1] #np.flip(cubicFaces['B'],1)
            
            # O onpenCV não entende esses arrays alterados como img. Reprojetar eles como arrays numpy funciona.
            cubicFaces['R'] = np.array(cubicFaces['R']) 
            cubicFaces['B'] = np.array(cubicFaces['B'])
            

            ## Inference

            bboxList = [] # armazena todas os bounding boxes para cada face

            all_faces = list(cubicFaces.values())
            # Concatenate middle cubic faces horizontally into a strip image
            img = np.concatenate(all_faces, axis=1)
            blob = cv.dnn.blobFromImage(img, 1/255.0, swapRB=True, crop=False)
            # DEBUG! 
            
            # Define a function for fire detection

            self.fire_net.setInput(blob)
            fire_outputs = self.fire_net.forward(self.fire_ln)
            fboxes, fconfidences, fclassIDs = get_bbox_from_output(fire_outputs, img)
            findices = cv.dnn.NMSBoxes(fboxes, fconfidences, 0.1, 0.4)
            
            if len(findices) > 0:
                for fbboxId in findices.flatten():
                    (x, y) = (fboxes[fbboxId][0], fboxes[fbboxId][1])
                    (w, h) = (fboxes[fbboxId][2], fboxes[fbboxId][3])
                    y = abs(y)
                    print("fire found",self.fire_classes[fclassIDs[fbboxId]],(x, y, w, h))
                    bboxList.append({
                        "class": self.fire_classes[fclassIDs[fbboxId]],
                        "confidence": fconfidences[fbboxId],
                        "bbox": (x, y, w, h)
                    })

            new_bboxList = {}
            face_chars = ['F', 'R', 'B', 'L', 'U', 'D']
            cubic_face_width = cubeFaceSize
            cubic_face_height = cubeFaceSize
            # Initialize the new_bboxList dictionary
            for face_char in face_chars:
                new_bboxList[face_char] = []

            first_item_of_class = []

            # Iterate over the bboxList and reorganize the bounding boxes based on the face character
            for bbox in bboxList:
                (x, y, w, h) = bbox['bbox']
                # Calculate the face index based on x-coordinate
                face_index = x // cubic_face_width
                # Get the original face character
                face_char = face_chars[face_index]
                # Calculate the pixel values relative to the individual cubic face
                x = x % cubic_face_width
                y = y % cubic_face_height

                #TODO: This is just a hack to invert the upper part of the cube projection. 
                # This is because somewere we inverted the image and passe to the recognition
                #so... we must undo.
                # There are several errors and fixes like this in my code.
                # The ideal solution would be to correct and streamline all the projection code.
                # https://paulbourke.net/panorama/cubemaps/
                
                if(face_char == 'U'):
                    y = cubic_face_height - y - h

                data = {'class': bbox['class'],'confidence': bbox['confidence'],'bbox': (x, y, w, h)}
                #print("data",data)
                if(bbox["class"] not in first_item_of_class):
                    slice_image = img[y:y+h, x:x+w]
                    aspect_ratio = slice_image.shape[1] / slice_image.shape[0]
                    # TODO: This is just a hack to solve it. Find out why
                    if(aspect_ratio > 0.2):
                        new_width = int(64 * aspect_ratio)
                        resized_image = cv.resize(slice_image, (new_width, 64))
                        _, img_buffer = cv.imencode('.png', resized_image)
                        base64_image = base64.b64encode(img_buffer).decode('utf-8')
                        data['sample_image'] = base64_image
                        first_item_of_class.append(bbox["class"])
                
                # create a slice of the panorama with that bbox and encode in base64
                # Append the converted bbox to the corresponding face character in the new_bboxList
                new_bboxList[face_char].append(data)

            #print("Localization bbox",new_bboxList)
            # adds ["bboxCubic"] to each label. Unused
            #convert_strip_bbox_to_cubic(new_bboxList,cubeFaceSize)
            returnAngles = True
            #print("new_bboxList",new_bboxList)


            for k,v in new_bboxList.items():
                for item in v:
                    ## transforms to pixels in the equirect
                    x,y,width,heigth = item["bbox"]
                    #print(x,y,k,width,heigth)
                    p1 = map_cube(x,y, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p2 = map_cube(x+width, y, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p3 = map_cube(x, y+heigth, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p4 = map_cube(x+width, y+heigth, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    
                    # debuug
                    #cubeImg=py360convert.cube_h2dice(img)
                    #cv.rectangle(cubeImg, (x, y), (x+width, y+heigth), color=(255,0,0), thickness=2)
                    #outFig(cubeImg,(x,y),(x+width,y+heigth),"cub_"+str(second)+str(k))
                    #outFig(img,(x,y),(x+width,y+heigth),"strip_"+str(second)+str(k))

                    item["pointsEquirect"] = [p1,p2,p3,p4]
                    item["centerPoint"] = find_center(item["pointsEquirect"])
                    #print("*****",item["class"],item["pointsEquirect"],"became",item["centerPoint"])
                    item["size"] = find_width_height(item["pointsEquirect"])
                    newItem = {item["class"]:{"centerPoint":item["centerPoint"],"size":item["size"]}}
                    
                    # save miniature for the first detected obj in this second
                    if("sample_image" in item):
                        newItem[item["class"]]['sample_image'] = item["sample_image"]
                        
                    outputLabels[second].append(newItem)

        return outputLabels
    
def handler(event, context):
    module_name = "fireLocalization"
    media_input_type = "equirectangular"
    module = FireLocalizationModule(module_name, media_input_type)
    module.consume_once(event)

if __name__ == "__main__":
    module_name = "fireLocalization"
    media_input_type = "equirectangular"
    module = FireLocalizationModule(module_name, media_input_type)
    module.start_consuming()

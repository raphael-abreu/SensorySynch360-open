from queue import Queue
from threading import Thread
import time
from .generate_timeline import generate_timeline,generate_timeline_ambient
import uuid, os
import base64
import cv2
import copy

media_conversion_functions = {}

# we already have equirectangular input, so we dont need to do anything
#return array of base64frames withour URI
def convert_to_equirectangular(media_base64):
    video_data = media_base64.split(',')[1] # remove the header
    video_frames = extract_frames_from_video(video_data) # 
    return video_frames
media_conversion_functions['equirectangular'] = convert_to_equirectangular


def create_media_version(media_data,module):
    print("Running conversion:",module['media_input_type'])
    return media_conversion_functions[module['media_input_type']](media_data)


filter_combine_rules = {}
# Base rule, just to format to the desired output
# TODO: Fix this hack. Make the input/output the same
def base(modules_effects_for_second):
    out = {}
    for module_effect in modules_effects_for_second:
        module_name, effect = module_effect.popitem()
        effect_type = effect.get('effectType')
        if module_name in out:
            out[module_name].append(effect)
        else:
            out[module_name] = []
            out[module_name].append(effect)
    return out
filter_combine_rules['base'] = base

def remove_aroma_if_wind_direction(modules_effects_for_second):
    """
    Removes aromas that fall inside the opposite bounding box of any wind effect.

    This function iterates through the wind effects in the given list and checks if any aroma effect
    is inside the opposite bounding box of that wind. If an aroma is inside the opposite bounding box of any wind,
    it is removed from the `modules_effects_for_second` list.

    Parameters:
    modules_effects_for_second (list): A list of dictionaries, where each dictionary represents a module and its effect.

    Returns:
    Out: A dictionary containing filtered modules and a list of their corresponding effects.
    """
    def calculate_opposite_area(center, size):
        opposite_center = {'lat': -center['lat'], 'lon': -center['lon']}
        opposite_size = {'width': size['width'], 'height': size['height']}
        return opposite_center, opposite_size
    def create_points(center, size):
        top_left = {'lat': center['lat'] + size['height'] / 2, 'lon': center['lon'] - size['width'] / 2}
        bottom_right = {'lat': center['lat'] - size['height'] / 2, 'lon': center['lon'] + size['width'] / 2}
        return top_left, bottom_right
    
    out = {}
    
    ## List for all the winds
    ## key é o nome do module, value é o efeito sensorial
    winds = [item for item in modules_effects_for_second if list(item.values())[0].get('effectType') == 'Wind']
    aromas = [item for item in modules_effects_for_second if list(item.values())[0].get('effectType') == 'Aroma']

    for wind in winds:
        wind_center = wind.get('centerPoint')
        wind_size = wind.get('size')
        if(not wind_size):
            continue
        wind_opposite_center, wind_opposite_size = calculate_opposite_area(wind_center, wind_size)
        wind_top_left, wind_bottom_right = create_points(wind_opposite_center, wind_opposite_size)

        for aroma in aromas:
            aroma_center = aroma['Aroma'].get('centerPoint')
            aroma_size = aroma['Aroma'].get('size')
            aroma_top_left, aroma_bottom_right = create_points(aroma_center, aroma_size)

            if (wind_top_left['lat'] >= aroma_top_left['lat'] >= wind_bottom_right['lat'] and
                    wind_bottom_right['lon'] <= aroma_bottom_right['lon'] <= wind_top_left['lon']):
                modules_effects_for_second.remove(aroma)

    for module_effect in modules_effects_for_second:
        module_name, effect = module_effect.popitem()
        if module_name in out:
            out[module_name].append(effect)
        else:
            out[module_name] = []
            out[module_name].append(effect)
    return out

filter_combine_rules['remove_aroma_if_wind_direction'] = remove_aroma_if_wind_direction


def reduce_heat_by_cold(modules_effects_for_second):
    """
    Reduces localized heat effects by 20% if there is an ambient cold effect.

    This function checks for the presence of an ambient cold effect. If found, it reduces the intensity of localized
    heat effects by 20%.

    Parameters:
    modules_effects_for_second (list): A list of dictionaries, where each dictionary represents a module and its effect.

    Returns:
    dict: A dictionary containing filtered modules and their corresponding effects with updated intensity values.
    """
    ambient_cold_found = False

    # Check for the presence of an ambient cold effect
    modules_effects_for_second_copy = copy.deepcopy(modules_effects_for_second)

    for module_effect in modules_effects_for_second_copy:
        module_name, effect = module_effect.popitem()
        effect_type = effect.get('effectType')
        ambient = effect.get('isAmbient', False)

        if ambient and effect_type == 'Cold':
            ambient_cold_found = True
            break
    # If an ambient cold effect is found, reduce the intensity of localized heat effects by 20%
    if ambient_cold_found:
        out = {}
        for module_effect in modules_effects_for_second:
            module_name, effect = module_effect.popitem()
            effect_type = effect.get('effectType')
            ambient = effect.get('isAmbient', False)
            intensity = int(effect.get('intensity', 0))
            modified_effect = effect.copy()

            # If the effect is localized heat, reduce its intensity by 30%
            if not ambient and effect_type == 'Heat':
                modified_effect['intensity'] = str(int(intensity * 0.3))

            if module_name in out:
                out[module_name].append(modified_effect)
            else:
                out[module_name] = [modified_effect]

        return out
    else:
        return modules_effects_for_second

filter_combine_rules['reduce_heat_by_cold'] = reduce_heat_by_cold


def apply_average_intensity(modules_effects_for_second):
    """
    Applies the average intensity value of effects with ambient=True to effects with the same type but without ambient property.

    This function calculates the average intensity value of effects with ambient=True for each type of effect,
    and then applies this average intensity to effects with the same type but without the ambient property.

    Parameters:
    modules_effects_for_second (list): A list of dictionaries, where each dictionary represents a module and its effect.

    Returns:
    dict: A dictionary containing filtered modules and their corresponding effects with updated intensity values.
    """
    intensity_sum = {}  # Dictionary to store sum of intensity values for each effect type with ambient=True
    count = {}  # Dictionary to store the count of effects for each type with ambient=True

    # Calculate sum of intensity values for effects with ambient=True
    modules_effects_for_second_copy = copy.deepcopy(modules_effects_for_second)
    for module_effect in modules_effects_for_second_copy:
        module_name, effect = module_effect.popitem()
        effect_type = effect.get('effectType')
        intensity = int(effect.get('intensity', 0))
        ambient = effect.get('isAmbient', False)
        aroma_type = effect.get('opts', {}).get('aromaType')


        if ambient:
            if effect_type not in intensity_sum:
                intensity_sum[effect_type] = {'total': 0, 'count': 0, 'aromaTypes': {}}

            intensity_sum[effect_type]['total'] += intensity
            intensity_sum[effect_type]['count'] += 1

            # If the ambient effect is an aroma, consider aromaType for matching
            if effect_type == 'Aroma' and aroma_type:
                if aroma_type not in intensity_sum[effect_type]:
                    intensity_sum[effect_type][aroma_type] = {'total': 0, 'count': 0}

                intensity_sum[effect_type][aroma_type]['total'] += intensity
                intensity_sum[effect_type][aroma_type]['count'] += 1


    # Calculate average intensity for effects with ambient=True
    average_intensity = {
            effect_type: {
                'total': intensity_sum[effect_type]['total'],
                'count': intensity_sum[effect_type]['count'],
                'aromaTypes': {
                    aroma_type: {
                        'total': intensity_sum[effect_type]['aromaTypes'][aroma_type]['total'],
                        'count': intensity_sum[effect_type]['aromaTypes'][aroma_type]['count']
                    }
                    for aroma_type in intensity_sum[effect_type]['aromaTypes']
                }
            }
            for effect_type in intensity_sum
        }    
    # Apply average intensity to effects without ambient property
    out = {}
    
    for module_effect in modules_effects_for_second:
        module_name, effect = module_effect.popitem()
        effect_type = effect.get('effectType')
        ambient = effect.get('isAmbient', False)
        modified_effect = effect.copy()

        if not ambient and effect_type in average_intensity:
            modified_effect['intensity'] = str(int(average_intensity[effect_type]['total'] / average_intensity[effect_type]['count']))

            # If the ambient effect is an aroma and has aromaType, apply intensity only for effects with the same aromaType
            if effect_type == 'Aroma' and aroma_type and aroma_type in average_intensity[effect_type]['aromaTypes']:
                modified_effect['intensity'] = str(int(average_intensity[effect_type]['aromaTypes'][aroma_type]['total'] / average_intensity[effect_type]['aromaTypes'][aroma_type]['count']))

        if module_name in out:
            out[module_name].append(modified_effect)
        else:
            out[module_name] = [modified_effect]

    return out
filter_combine_rules['apply_average_intensity'] = apply_average_intensity


def apply_rule(modules_effects_for_second,filterAndCombineRule):
    return filter_combine_rules[filterAndCombineRule](modules_effects_for_second)


def doLabels2Effects(labels,labels2effectsDict,filterAndCombineRule = None):
    modules_effects = {}
    is_module_ambient = {}
    for module_name,labelDict in labels2effectsDict.items():
        labelsDictNames = {effect: None for effect in labelDict.keys()}
        # Iterate through selected effects and collect unique souceTags. 
        # SourceTags are only available for ambient effects
        for effect in labelDict:
            sourceTag = list(labelDict[effect].keys())
            labelsDictNames[effect] = sourceTag if sourceTag else None
        res,has_ambient = labels2effects(labels[module_name],labelDict)
        modules_effects[module_name] = res
        is_module_ambient[module_name] = has_ambient


    print('Applying Filters')
    first_value = next(iter(modules_effects.values()))
    total_seconds = first_value.keys()
    for second in total_seconds:
        modules_effects_for_second = get_module_effects_list_for_second(modules_effects,second)
        if filterAndCombineRule and filterAndCombineRule in filter_combine_rules:
            newEffectsModules = apply_rule(modules_effects_for_second,filterAndCombineRule)
        else:
            print(f'ALERT: Function {filterAndCombineRule} does not exist. Ignoring')
            newEffectsModules = apply_rule(modules_effects_for_second,'base')
        for module_name,_ in modules_effects.items():
            #print("*********",module_name,second,newEffectsModules)
            if(module_name in newEffectsModules):
                modules_effects[module_name][second] = newEffectsModules[module_name]

    
    output = []
    print("Generating timeline")
    for module_name,labelDict in labels2effectsDict.items():    
        effectList = {key: value for key, value in modules_effects.items()}
        labelsDictNames = {effect: None for effect in labelDict.keys()}
        for effect in labelsDictNames:
            for sourceTag in labelsDictNames[effect] or [None]:
                #print("Generating timeline for",effect,sourceTag,"with",effectList[module_name])
                if(is_module_ambient[module_name]):
                    res = generate_timeline_ambient(effectList[module_name], effect, sourceTag)
                else:
                    res = generate_timeline(effectList[module_name], effect)
                output.extend(res)
    #print("-------------OUT EFFECTLIST  ---------------",output)

    return output

def inspectobj(obj, indent=0):
    """Recursively inspect the keys and their types in a Python object."""
    if isinstance(obj, dict):
        for key, value in obj.items():
            print(' ' * indent + f'Key: {key} - Type: {type(key)}')
            if isinstance(value, (dict, list, tuple)):
                inspectobj(value, indent + 2)
            else:
                print(' ' * (indent + 2) + f'Value: {value} - Type: {type(value)}')
    elif isinstance(obj, (list, tuple)):
        for index, item in enumerate(obj):
            print(' ' * indent + f'Index: {index} - Type: {type(index)}')
            if isinstance(item, (dict, list, tuple)):
                inspectobj(item, indent + 2)
            else:
                print(' ' * (indent + 2) + f'Item: {item} - Type: {type(item)}')

def get_module_effects_list_for_second(modules_effects, target_second):
    effects_for_given_second = []

    for module_name, seconds in modules_effects.items():
            for second,effects in seconds.items():
                if(second == target_second):
                    for effect in effects:
                        effects_for_given_second.append({module_name:effect})
    return effects_for_given_second


def labels2effects(labels,effect_dict):
    has_ambient = False
    effects = {}
    for second, labelsListForSecond in labels.items():
        effects[second] = []
    for second, labelsListForSecond in labels.items():
        for _, item in enumerate(labelsListForSecond):
            if isinstance(item, dict):
                labelName = list(item.keys())[0]
            else:
                # just some hack to keep the same code structure. 
                # if the labels came from sceneRecognition, instead of a list of objs, 
                # will be a simple array with strings
                labelName = item
                item = {labelName:item}
            for effect_name, labels_and_concepts in effect_dict.items():
                if any(labelName == s for s in labels_and_concepts.keys()):
                    effect = {}
                    effect["effectType"] = effect_name
                    if "centerPoint" in item[labelName]:
                        effect["centerPoint"] = item[labelName]["centerPoint"]
                    if "size" in item[labelName]:
                        effect["size"] = item[labelName]["size"]
                    else:
                        effect["sourceTag"] = labelName             
                        effect["isAmbient"] = True
                        has_ambient = True
                    if "intensity" in labels_and_concepts[labelName]:
                        effect["intensity"] = labels_and_concepts[labelName]["intensity"]
                    if "propagation" in labels_and_concepts[labelName]:
                        effect["propagation"] = labels_and_concepts[labelName]["propagation"]
                    if "opts" in labels_and_concepts[labelName]:
                        effect["opts"] = labels_and_concepts[labelName]["opts"]
                    effects[second].append(effect)
                    #print(effect)
    return effects,has_ambient



class FileVideoStream:
    def __init__(self, path, seconds_to_skip=0, queueSize=128):
        # initialize the file video stream along with the boolean
        # used to indicate if the thread should be stopped or not
        self.stream = cv2.VideoCapture(path)
        self.stopped = False
        self.fps = self.stream.get(cv2.CAP_PROP_FPS)
        self.frame_count = int(self.stream.get(cv2.CAP_PROP_FRAME_COUNT))
        self.second = 0
        self.seconds_to_skip = seconds_to_skip
        # initialize the queue used to store frames read from
        # the video file
        self.Q = Queue(maxsize=queueSize)

    def start(self):
        # start a thread to read frames from the file video stream
        t = Thread(target=self.update, args=())
        t.daemon = True
        t.start()
        return self

    def update(self):
        # keep looping infinitely
        while True:
            # if the thread indicator variable is set, stop the
            # thread
            if self.stopped:
                return
            # otherwise, ensure the queue has room in it
            if not self.Q.full():
                # read the next frame from the file
                frame_no = int(self.fps * self.second)
                self.stream.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
                self.second += self.seconds_to_skip  # Go to the next second
                (grabbed, frame) = self.stream.read()
                # if the `grabbed` boolean is `False`, then we have
                # reached the end of the video file
                if not grabbed:
                    self.stop()
                    return
                # add the frame to the queue
                self.Q.put(frame)

    def more(self):
        # return True if there are still frames in the queue
        return self.Q.qsize() > 0 or not self.stopped

    def read(self):
        # return next frame in the queue
        return self.Q.get()

    def stop(self):
        # indicate that the thread should be stopped
        self.Q.put(None)
        self.stopped = True

# WARNING! THIS ONLY WORKS IF THE CONSUMER IS FASTER THAN THE PRODUCER!
# seconds_to_skip It should be useful to perform faster recognitions, but with lower temporal fidelity
def extract_frames_from_video(video_data):
    # Convert the base64 data to bytes
    video_bytes = base64.b64decode(video_data)

    # Save the video to a file
    video_path = './upload/'+str(uuid.uuid4())+ '.mp4'
    with open(video_path, 'wb') as video_file:
        video_file.write(video_bytes)
    video_frames = {}
    seconds_to_skip = 1
    fvs = FileVideoStream(video_path, seconds_to_skip).start()
    second = 0
    while fvs.more():
        frame = fvs.read()
        if(frame is None):
            break
        _, encoded_frame = cv2.imencode('.jpg', frame)
        base64_frame = base64.b64encode(encoded_frame).decode('utf-8')
        video_frames[second] = base64_frame
        second+=seconds_to_skip
    os.remove(video_path)
    fvs.stop()
    return video_frames

# debug method
def save_frames_to_disk(video_frames):
    frames_dir = 'extracted_frames'
    os.makedirs(frames_dir, exist_ok=True)

    for second, frame_data in video_frames.items():
        frame_path = os.path.join(frames_dir, f'frame_{second}.jpg')
        with open(frame_path, 'wb') as frame_file:
            frame_bytes = base64.b64decode(frame_data)
            frame_file.write(frame_bytes)
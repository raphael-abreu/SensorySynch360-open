import numpy as np
import py360convert # Biblioteca de conversão de equirect-cubemap https://github.com/sunset1995/py360convert
import cv2 as cv
import threading
import base64
import boto3
import sys,os
from decouple import config
# Get the current directory of the script
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add the parent directory to sys.path to enable relative imports
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from cubicObj_utils import *
from BaseRecognitionModule import BaseRecognitionModule
debug = True

class AWSLocalizationModule(BaseRecognitionModule):
    def __init__(self, module_name, media_input_type, depends_on=[]):
        super().__init__(module_name, media_input_type, depends_on=[])
        AWS_KEY = config('AWS_KEY')
        AWS_SECRET = config('AWS_SECRET')
        #self.rek_client = boto3.client('rekognition', aws_access_key_id=AWS_KEY,
        #aws_secret_access_key=AWS_SECRET,
        #                   region_name='us-east-1')
        # Loading models
        ## OpenImages
        self.classes = open('./awsLocalizationModule/yolo-openImages/openimages.names').read().strip().split('\n')
        self.net = cv.dnn.readNetFromDarknet('./awsLocalizationModule/yolo-openImages/yolov3-openimages.cfg', './awsLocalizationModule/yolo-openImages/yolov3-openimages.weights')
        self.ln = self.net.getUnconnectedOutLayersNames()

    
    def pre_process(self, mediaList):
        return mediaList

    def inference(self,mediaList):
        total_frames = len(mediaList)
        outputLabels = {}
        # Process each frame
        print("starting aws recognition module")
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
            #if(debug):
            #    cv.imwrite('/windir/c/Users/rapha/Documents/GitHub/SensorySynch360/pipeline/img.jpg', img)
            
            # Define a function for classic YOLO processing
            def process_yolo():
                self.net.setInput(blob)
                outputs = self.net.forward(self.ln)
                boxes, confidences, classIDs = get_bbox_from_output(outputs, img)
                indices = cv.dnn.NMSBoxes(boxes, confidences, 0.1, 0.4)
                
                if len(indices) > 0:
                    for bboxId in indices.flatten():
                        (x, y) = (boxes[bboxId][0], boxes[bboxId][1])
                        (w, h) = (boxes[bboxId][2], boxes[bboxId][3])
                        if(debug): 
                            print("yolo found",self.classes[classIDs[bboxId]],(x, y, w, h))
                        if(self.classes[classIDs[bboxId]] not in ["Person","Clothing"]):
                            bboxList.append({
                                "class": self.classes[classIDs[bboxId]],
                                "confidence": confidences[bboxId],
                                "bbox": (x, y, w, h)
                            })

        
            # Define a function for AWS processing
            def process_aws():
                im_rgb = cv.cvtColor(img, cv.COLOR_BGR2RGB)
                _, im_buf_arr = cv.imencode(".png", im_rgb)
                byte_im = im_buf_arr.tobytes()
                #with open('/windir/c/Users/rapha/Documents/GitHub/SensorySynch360/pipeline/img.jpg', 'rb') as image:
                #    response = rek_client.detect_labels(Image={'Bytes': image.read()},MaxLabels=20)
                response = self.rek_client.detect_labels(Image={'Bytes': byte_im}, 
                                                    Features=['GENERAL_LABELS'],
                                                    Settings={'GeneralLabels': {'LabelExclusionFilters': ['Shoe','Hat','Tie','Clothing', 'Glove', 'Glasses', 'Helmet','Handbag','Adult','Male','Man','Woman','Female']}})
                #print(response)
                #d = d/0
                w, h = img.shape[:-1][::-1]
                
                for label in response['Labels']:
                    name = label['Name']
                    
                    for instance in label['Instances']:
                        bbox = instance['BoundingBox']
                        x0 = int(bbox['Left'] * w)
                        y0 = int(bbox['Top'] * h)
                        x1 = x0 + int(bbox['Width'] * w)
                        y1 = y0 + int(bbox['Height'] * h)
                        if(debug): 
                            print("aws found",name,(x0, y0, int(bbox['Width'] * w), int(bbox['Height'] * h)))
                        bboxList.append({
                            "class": name,
                            "confidence": label['Confidence'] / 10,
                            "bbox": (x0, y0, int(bbox['Width'] * w), int(bbox['Height'] * h))
                        })

            #process_aws()
            process_yolo()
            # Create threads for each processing task
            #yolo_thread = threading.Thread(target=process_yolo)
            #aws_thread = threading.Thread(target=process_aws)

            # Start the threads
            #yolo_thread.start()
            #aws_thread.start()

            # Wait for all threads to finish
            #yolo_thread.join()
            #aws_thread.join()

            #print("old bboxlist",bboxList)
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
                data = {'class': bbox['class'],'confidence': bbox['confidence'],'bbox': (x, y, w, h)}
                #print(data)
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

            for k,v in new_bboxList.items():
                for item in v:
                    ## transforms to pixels in the equirect
                    x,y,width,heigth = item["bbox"]
                    p1 = map_cube(x,y, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p2 = map_cube(x+width, y, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p3 = map_cube(x, y+heigth, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    p4 = map_cube(x+width, y+heigth, k, cubeFaceSize, equirectW, equirectH,returnAngles)
                    item["pointsEquirect"] = [p1,p2,p3,p4]
                    item["centerPoint"] = find_center(item["pointsEquirect"])
                    #print("*****",item["class"],item["pointsEquirect"],"became",item["centerPoint"])

                    item["size"] = find_width_height(item["pointsEquirect"])
                    newItem = {item["class"]:{"centerPoint":item["centerPoint"],"size":item["size"]}}
                    # save miniature for the first detected obj in this second
                    if("sample_image" in item):
                        newItem[item["class"]]['sample_image'] = item["sample_image"]
                        
                    outputLabels[second].append(newItem)
        #print("localization output",outputLabels,"\n\n\n\n\n\n\n")
        return outputLabels
def handler(event, context):
    module_name = "effectLocalization"
    media_input_type = "equirectangular"
    module = AWSLocalizationModule(module_name, media_input_type)
    module.consume_once(event)
if __name__ == "__main__":
    module_name = "effectLocalization"
    media_input_type = "equirectangular"
    module = AWSLocalizationModule(module_name, media_input_type)
    module.start_consuming()
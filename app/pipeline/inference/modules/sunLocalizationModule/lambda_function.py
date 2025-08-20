from skimage import measure
import numpy as np
import cv2 as cv
import base64
import os,sys
# Get the current directory of the script
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add the parent directory to sys.path to enable relative imports
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from cubicObj_utils import *
from BaseRecognitionModule import BaseRecognitionModule

class SunLocalizationModule(BaseRecognitionModule):
    def __init__(self, module_name, media_input_type, depends_on=[]):
        super().__init__(module_name, media_input_type, depends_on=[])
    
    def pre_process(self, mediaList):
        return mediaList
    
    def inference(self,mediaList):
        print("Running Sun!")
        ## LOADING
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
            image = cv.imdecode(image_array, cv.IMREAD_COLOR)  # Decode as BGR image

            height, width = image.shape[:2]
            # Set the bottom half of the image to all black
            image[height//2:, :] = 0
            gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
            blurred = cv.GaussianBlur(gray, (11, 11), 0)

            ## PRE PROCESSING
            thresh = cv.threshold(blurred, 220, 255, cv.THRESH_BINARY)[1]
            thresh = cv.erode(thresh, None, iterations=2)
            thresh = cv.dilate(thresh, None, iterations=4)

                
            ## INFERENCE
            
            labels = measure.label(thresh, connectivity=2, background=0)
            mask = np.zeros(thresh.shape, dtype="uint8")
            # loop over the unique components
            for label in np.unique(labels):
                # if this is the background label, ignore it
                if label == 0:
                    continue
                # otherwise, construct the label mask and count the
                # number of pixels 
                labelMask = np.zeros(thresh.shape, dtype="uint8")
                labelMask[labels == label] = 255
                numPixels = cv.countNonZero(labelMask)
                # if the number of pixels in the component is sufficiently
                # large, then add it to our mask of "large blobs"
                if numPixels > 400:
                    mask = cv.add(mask, labelMask)
                    

            cnts, hierarchy = cv.findContours(mask.copy(), cv.RETR_EXTERNAL,
                cv.CHAIN_APPROX_SIMPLE)
            if cnts == () or cnts == None:
                continue
            c = max(cnts, key = cv.contourArea)
            x,y,w,h = cv.boundingRect(c)
            
            ((cX, cY), radius) = cv.minEnclosingCircle(c)
            
            ## POST-PROCESSING
            
            height, width, channels = image.shape
            
            p1 = getLatLon(x,y,width,height)
            p2 = getLatLon(x+w,y,width,height)
            p3 = getLatLon(x,y+h,width,height)
            p4 = getLatLon(x+w,y+h,width,height)
            
            sunLocation = p1,p2,p3,p4 
            center = find_center(sunLocation)
            effect = {"centerPoint":center,"size":find_width_height(sunLocation)}

            resp = [{"sun":effect}]
            
            outputLabels[second] = resp

        return outputLabels
def handler(event, context):
    module_name = "sunLocalization"
    media_input_type = "equirectangular"
    module = SunLocalizationModule(module_name, media_input_type)
    module.consume_once(event)
if __name__ == "__main__":
    module_name = "sunLocalization"
    media_input_type = "equirectangular"
    module = SunLocalizationModule(module_name, media_input_type)
    module.start_consuming()

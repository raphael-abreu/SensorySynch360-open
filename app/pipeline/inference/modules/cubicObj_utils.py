import math
import numpy as np
import cv2 as cv

def outFig(image,p1,p2,second):
    font = cv.FONT_HERSHEY_SIMPLEX 
    org = p1
    fontScale = 1
    color = (255, 0, 0) 
    thickness = 2
    image = cv.putText(image, '* '+str(p1), org, font,  
            fontScale, color, thickness, cv.LINE_AA) 
    org = p2
    image = cv.putText(image, '* '+str(p2), org, font,  
            fontScale, color, thickness, cv.LINE_AA) 
    cv.imwrite('img'+str(second)+'.jpg', image)

def getLatLon(x,y,imgWidth,imgHeight):
    lat = (y * 180)/(imgHeight)-90
    #print(y,imgHeight)
    lon = (x * 360)/(imgWidth)-180
    return -lat,-lon # it is inverted because we are mapping from inside the sphere

#https://answers.opencv.org/question/180430/convert-cubemap-pixel-coordinates-to-equivalents-in-equirectangular/
def get_theta_phi( _x, _y, _z):
    dv = math.sqrt(_x*_x + _y*_y + _z*_z)
    x = _x/dv
    y = _y/dv
    z = _z/dv
    theta = math.atan2(y, x)
    phi = math.asin(z)
    return  -phi,-theta
         
                          
# x,y position in cubemap
# cw  cube width
# W,H size of equirectangular image

def map_cube(x, y, side, cw, W, H,returnAngles=False):
    # u,v
    u = 2*(float(x)/cw - 0.5)
    v = 2*(float(y)/cw - 0.5)

    if side == "F":
        theta, phi = get_theta_phi( 1, u, v )
    elif side == "R":
        theta, phi = get_theta_phi( -u, 1, v )
    elif side == "L":
        theta, phi = get_theta_phi( u, -1, v )
    elif side == "B":
        theta, phi = get_theta_phi( -1, -u, v )
    elif side == "D":
        theta, phi = get_theta_phi( -v, u, 1 )
    elif side == "U":
        theta, phi = get_theta_phi( v, u, -1 )
    #print("theta:",math.degrees(theta),"Phi:",math.degrees(phi))

    # get pixel from u,v
    _u = 0.5+0.5*(theta/math.pi)
    _v = 0.5+(phi/math.pi)
    x= _u*W
    y= _v*H
    if (returnAngles):
        return math.degrees(theta),math.degrees(phi)
    else:
        return x,y
    
def find_width_height(latLongObjects):  
        width = abs((latLongObjects[0][1] - latLongObjects[1][1])%180)
        height = abs((latLongObjects[0][0] - latLongObjects[2][0])%180)
        return {"width":width,"height":height}
def same_signall(a,b):
    if b < 0 and a > 0:
        return -a
    else:
        return a
    
def find_center(latLongObjects):
    # Extract top left and bottom right longitudes
    top_left_lon = latLongObjects[0][1]
    bottom_right_lon = latLongObjects[3][1]
    
    # Check for wraparound at the 180th meridian
    if top_left_lon < 0 and bottom_right_lon > 0:
        # Calculate average longitude considering wraparound
        avg_lon = (top_left_lon + bottom_right_lon) / 2
        
        # Handle wraparound for negative and positive longitudes
        if avg_lon < 0:
            avg_lon %= 180
        else:
            avg_lon %= -180
    else:
        # No wraparound, calculate average longitude normally
        avg_lon = (top_left_lon + bottom_right_lon) / 2
    
    # Calculate center latitude as the average of top left and bottom right latitudes
    avg_lat = (latLongObjects[0][0] + latLongObjects[2][0]) / 2
    
    # Construct and return the center point as a dictionary
    center_point = {
        "lat": avg_lat,
        "lon": avg_lon
    }
    
    return center_point



def get_bbox_from_output(outputs, img):
    boxes = []
    confidences = []
    classIDs = []
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            if confidence > 0.4:
                box = detection[:4] * np.array([img.shape[1], img.shape[0], img.shape[1], img.shape[0]])
                (x, y, w, h) = box.astype("int")

                # Filter the bounding box coordinates to avoid overflowing the image bounds
                x = max(0, x)
                y = max(0, y)
                w = min(w, img.shape[1] - x)
                h = min(h, img.shape[0] - y)

                # Adjust the coordinates to find a middle ground
                x -= w //2
                y -= h //2

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                classIDs.append(classID)
    return boxes,confidences,classIDs


# ordem F R B L U D
#       U
#     F R B L      
#       D
def convert_strip_bbox_to_cubic(new_bboxList,cubeFaceSize,debug=False):
    # Scaling factor
    sxy = {'F': [1, 1], 'R': (2, 1), 'B': (3, 1), 'L': (0, 1), 'U': (1, 0), 'D':(1, 2)} 
    for k,v in new_bboxList.items():
        for item in v:
            (x,y,w,h) = item["bbox"]
            x,y = (x,y)+(cubeFaceSize*np.asarray(sxy[k]))
            item["bboxCubic"] = [x,y,w,h]



import base64
from decouple import config
import sys,os
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2_grpc

from clarifai_grpc.grpc.api import service_pb2, resources_pb2
from clarifai_grpc.grpc.api.status import status_code_pb2

# Get the current directory of the script
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add the parent directory to sys.path to enable relative imports
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from BaseRecognitionModule import BaseRecognitionModule


class SeceneUnderstandingModule(BaseRecognitionModule):
    def __init__(self, module_name, media_input_type, depends_on=[]):
        super().__init__(module_name, media_input_type, depends_on=[])
        AuthKey = config('CLARIFAI_AUTH')
        # This is how you authenticate.
        self.metadata = (('authorization', 'Key ' + AuthKey),)


    def pre_process(self, mediaList):
        return mediaList
    
    def inference(self,mediaList):
        print("running Scene Understanding  module")

        total_frames = len(mediaList)
        outputLabels = {}
        # Process each frame
        for second, frame in mediaList.items():
            second = int(second)
            outputLabels[second] = []
            print("starting second",second)

            self.send_partial_result((second/total_frames)*100)
            # frame is base64 already!+
            binary_data = base64.b64decode(frame)
            file_bytes = binary_data

                
            ## INFERENCE   
            stub = service_pb2_grpc.V2Stub(ClarifaiChannel.get_grpc_channel())     
            post_model_outputs_response = stub.PostModelOutputs(
                service_pb2.PostModelOutputsRequest(
                    model_id='aaa03c23b3724a16a56b629203edc62c',
                    inputs=[
                        resources_pb2.Input(
                            data=resources_pb2.Data(
                                image=resources_pb2.Image(
                                    base64=file_bytes
                                )
                            )
                        )
                    ]
                ),
                metadata=self.metadata
            )

            if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
                raise Exception("Post model outputs failed, status: " + post_model_outputs_response.status.description)
                
            # Since we have one input, one output will exist here.
            output = post_model_outputs_response.outputs[0]

            for concept in output.data.concepts:
                newItem = concept.name
                outputLabels[second].append(newItem)

            print("understanding output",outputLabels)
        return outputLabels
def handler(event, context):
    module_name = "sceneUnderstanding"
    media_input_type = "equirectangular"
    module = SeceneUnderstandingModule(module_name, media_input_type)
    module.consume_once(event)
if __name__ == "__main__":
    module_name = "sceneUnderstanding"
    media_input_type = "equirectangular"
    module = SeceneUnderstandingModule(module_name, media_input_type)
    module.start_consuming()
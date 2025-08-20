![SensorySynch360](logo.png)

A tool to annotate of sensory effects in 360 videos, that combine AI and human author refinement


# Modules
### Editor
	The main interface to user interaction. Uses panolens and ThreeJS
### Inference
	Machine learning engine to recognize sensory effects of 360 videos.
	The Engine is composed of several pre-trained models and ensembled with a higher level neural network.
![idea](inference/idea.png)
### Geometry
	Geometry utils to convert coordinates on panoramas, slicing panoramas, and converting between equirentangular a gnomonic projections.
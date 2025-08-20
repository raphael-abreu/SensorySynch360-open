FROM python:3.9-slim
WORKDIR /app
COPY ./sceneUnderstandingModule/requirements.txt /app/
RUN pip install -r requirements.txt
CMD ["python","sceneUnderstandingModule/lambda_function.py"]
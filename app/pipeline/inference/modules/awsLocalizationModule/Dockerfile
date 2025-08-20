FROM python:3.9-slim
WORKDIR /app
COPY ./awsLocalizationModule/requirements.txt /app/
RUN pip install -r requirements.txt
CMD ["python","awsLocalizationModule/lambda_function.py"]
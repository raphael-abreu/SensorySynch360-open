FROM python:3.9-slim
WORKDIR /app
COPY ./fireLocalizationModule/requirements.txt /app/
RUN pip install -r requirements.txt
CMD ["python","fireLocalizationModule/lambda_function.py"]
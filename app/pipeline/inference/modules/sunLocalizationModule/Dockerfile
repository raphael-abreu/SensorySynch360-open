FROM python:3.9-slim
WORKDIR /app
COPY ./sunLocalizationModule/requirements.txt /app/
RUN pip install -r requirements.txt
CMD ["python","sunLocalizationModule/lambda_function.py"]
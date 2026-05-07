import warnings
warnings.filterwarnings("ignore")
import numpy as np
import sklearn
import pandas as pd
import keras
import tensorflow as tf

from keras.models import Sequential
from keras.layers import Dense
from keras.models import load_model
from sklearn.model_selection import train_test_split
"""
data = pd.read_csv("../dataset/dataset.csv")
y = data['label']
x = data.drop('label',axis=1)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
print("Using ",len(x_train)," to train the model")
model = Sequential()
#model.add(Dense(units=256, activation='relu'))
#model.add(Dense(units=128, activation='relu'))
model.add(Dense(units=64, activation='relu'))
model.add(Dense(units=32, activation='relu'))
model.add(Dense(units=16, activation='relu'))
model.add(Dense(units=1, activation='sigmoid'))
adam = keras.optimizers.Adam(learning_rate=0.001)
model.compile(loss='binary_crossentropy', optimizer=adam, metrics=["accuracy"])

model.fit(x_train, y_train, epochs=20)
loss_metrics = model.evaluate(x_test, y_test)
print("loss and metrics")
print("loss = ",loss_metrics[0])
print("accuracy = ",loss_metrics[1])

keras.saving.save_model(model, 'model.keras')
model2 = load_model("model.keras")
predict = model.predict(x_test)
print(predict)
"""
#data = np.array([45, 0.23412]).reshape(1,2)
model2 = load_model("model/model.keras")
#model2 = load_model("model.keras")
#print(model2.predict(data))
#"""



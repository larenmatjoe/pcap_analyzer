import numpy as np
import sklearn
import pandas as pd
import keras
import tensorflow as tf

from keras.models import Sequential
from keras.layers import Dense
from sklearn.model_selection import train_test_split

data = pd.read_csv("data.csv")
y = data['label']
x = data.drop('label',axis=1)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
model = Sequential()
model.add(Dense(units=16, activation='relu'))
model.add(Dense(1, activation='sigmoid'))
adam = keras.optimizers.Adam(learning_rate=0.001)
model.compile(loss='binary_crossentropy', optimizer=adam, metrics=["accuracy"])

model.fit(x_train, y_train, epochs=100)
loss_metrics = model.evaluate(x_test, y_test)
print("loss and metrics")
print("loss = ",loss_metrics[0])
print("accuracy = ",loss_metrics[1])

"""
predict = model.predict(x_test)
"""




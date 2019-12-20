## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms on the seizure dataset.

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.svm import SVC

######################################### Reading and Splitting the Data ###############################################

# Read in all the data.
data = pd.read_csv('seizure_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100 # DO NOT CHANGE

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the parameter 'shuffle' set to true and the 'random_state' set to 100.
# XXX
x_train, x_test, y_train, y_test = train_test_split(x_data,y_data,test_size=0.3,random_state=100,shuffle=True)


# ###################################### Without Pre-Processing Data ##################################################
# XXX
# TODO: Fit the SVM Classifier (with the tuned parameters)  on the x_train and y_train data.
# XXX
svm = SVC(kernel='rbf',C=0.001)
svm.fit(x_train,y_train)

# XXX
# TODO: Predict the y values for x_test and report the test accuracy using the accuracy_score method.
# XXX

# y_pred_train = svm.predict(x_train).round()
y_pred_test  = svm.predict(x_test ).round()

# print ("TRAIN Accuracy Score [Support Vector M] = %.4f" % accuracy_score(y_train,y_pred_train))
print ("SVM  Accuracy Score [BEFORE] = %.4f" % accuracy_score(y_test, y_pred_test ))
print (" ")

# ###################################### With Data Pre-Processing ##################################################
# XXX
# TODO: Standardize or normalize x_train and x_test using either StandardScalar or normalize().
# Call the processed data x_train_p and x_test_p.
# XXX
x_train_p = normalize(x_train)
x_test_p  = normalize(x_test )

# x_train_p = StandardScaler().fit_transform(x_train)
# x_test_p  = StandardScaler().fit_transform(x_test )

# XXX
# TODO: Fit the SVM Classifier (with the tuned parameters) on the x_train_p and y_train data.
# XXX

svm.fit(x_train_p,y_train)

# XXX
# TODO: Predict the y values for x_test_p and report the test accuracy using the accuracy_score method.
# XXX

y_pred_test_p  = svm.predict(x_test_p ).round()

print ("SVM  Accuracy Score [AFTER ] = %.4f" % accuracy_score(y_test, y_pred_test_p))
print (" ")


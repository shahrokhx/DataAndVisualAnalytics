## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to recognize seizure from EEG brain wave signals

import numpy as np
import pandas as pd
import time 

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.preprocessing import StandardScaler, normalize, MinMaxScaler
######################################### Reading and Splitting the Data ###############################################

# Read in all the data.
data = pd.read_csv('seizure_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data. DO NOT CHANGE.
random_state = 100 # DO NOT CHANGE

# XXX
# TODO: Split each of the features and labels arrays into 70% training set and
#       30% testing set (create 4 new arrays). Call them x_train, x_test, y_train and y_test.
#       Use the train_test_split method in sklearn with the parameter 'shuffle' set to true 
#       and the 'random_state' set to 100.
# XXX
x_train, x_test, y_train, y_test = train_test_split(x_data,y_data,test_size=0.3,random_state=100,shuffle=True)

print "X ===>",len(x_data),' : ',len(x_train), ' , ',len(x_test)
print "y ===>",len(y_data),' : ',len(x_train), ' , ',len(x_test) 

# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX

linreg = LinearRegression()
linreg.fit(x_train,y_train)

# XXX
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Use y_predict.round() to get 1 or 0 as the output.
# XXX

y_pred_train = linreg.predict(x_train).round()
y_pred_test  = linreg.predict(x_test ).round()


print ("TRAIN Accuracy Score [LinearRegression] = %.4f" % accuracy_score(y_train,y_pred_train))
print ("TEST  Accuracy Score [LinearRegression] = %.4f" % accuracy_score(y_test, y_pred_test ))
print (" ")

# ############################################### Multi Layer Perceptron #################################################
# XXX
# TODO: Create an MLPClassifier and train it.
# XXX

mlp =  MLPClassifier()
mlp.fit(x_train,y_train)

# XXX
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

y_pred_train = mlp.predict(x_train).round()
y_pred_test  = mlp.predict(x_test ).round()


print ("TRAIN Accuracy Score [MLPClassifier   ] = %.4f" % accuracy_score(y_train,y_pred_train))
print ("TEST  Accuracy Score [MLPClassifier   ] = %.4f" % accuracy_score(y_test, y_pred_test ))
print (" ")

# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX
rfc = RandomForestClassifier()
rfc.fit(x_train,y_train)
# XXX
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

y_pred_train = rfc.predict(x_train).round()
y_pred_test  = rfc.predict(x_test ).round()


print ("TRAIN Accuracy Score [RandomForest    ] = %.4f" % accuracy_score(y_train,y_pred_train))
print ("TEST  Accuracy Score [RandomForest    ] = %.4f" % accuracy_score(y_test, y_pred_test ))
print (" ")

# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
rfc_tune = RandomForestClassifier()
tuned_parameters = {'n_estimators': [20, 30, 50, 100]   , 'max_depth': [5, 10, 20, 50, 100]}
                   
tuned_clf = GridSearchCV(rfc_tune, tuned_parameters, cv=10)
x_train_n = normalize(x_train)
x_train_s = StandardScaler().fit_transform(x_train)
tuned_clf.fit(x_train_s, y_train)

print tuned_clf.best_params_
print tuned_clf.best_score_

############################################ Support Vector Machine ###################################################
# XXX
# TODO: Create a SVC classifier and train it.
# XXX
svm = SVC()
svm.fit(x_train,y_train)
# XXX
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
y_pred_train = svm.predict(x_train).round()
y_pred_test  = svm.predict(x_test ).round()


print ("TRAIN Accuracy Score [Support Vector M] = %.4f" % accuracy_score(y_train,y_pred_train))
print ("TEST  Accuracy Score [Support Vector M] = %.4f" % accuracy_score(y_test, y_pred_test ))
print (" ")
# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
svm_tune = SVC()
# tuned_parameters = [{'kernel': ['rbf']   , 'C': [0.001, 0.01, 0.1, 1., 10., 100]},
#                     {'kernel': ['linear'], 'C': [0.001, 0.01, 0.1, 1., 10., 100]}]

tuned_parameters = {'kernel': ['rbf', 'linear'], 'C': [0.001, 0.01, 0.1, 1., 10., 100., 1000.]}

tuned_clf = GridSearchCV(svm_tune, tuned_parameters, cv=10)

x_train_n = normalize(x_train)
x_train_s = StandardScaler().fit_transform(x_train)

tuned_clf.fit(x_train_n, y_train)


print tuned_clf.best_params_
print tuned_clf.best_score_


# XXX 
# ########## PART C ######### 
# TODO: Print your CV's highest mean testing accuracy and its corresponding mean training accuracy and mean fit time.
# 		State them in report.txt.
# XXX


mean_train_score = tuned_clf.cv_results_['mean_train_score']
mean_fit_time    = tuned_clf.cv_results_['mean_fit_time'   ]
mean_test_score  = tuned_clf.cv_results_['mean_test_score' ]

params     = tuned_clf.cv_results_['params' ]
index_best = params.index(tuned_clf.best_params_)


print mean_train_score
print mean_fit_time
print mean_test_score
print '---------------------------------------------'
print 'For the Best Combination of Hyperparameter values -> ',params[index_best]
print 'The Best Score = %.4f' % tuned_clf.best_score_
print 'The Index of Best Parameters =', index_best
print '---------------------------------------------'
print "Mean Train Score = %.4f" % mean_train_score [index_best]
print "Mean Fit   Time  = %.4f" % mean_fit_time    [index_best]
print "Mean Test  Score = %.4f" % mean_test_score  [index_best]

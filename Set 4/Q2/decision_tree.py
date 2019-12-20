from util import entropy, information_gain, partition_classes
import numpy as np 
import ast
import csv
from collections import Counter as yCount
from collections import defaultdict as dDict

class DecisionTree(object):
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        # self.tree = []
        #self.tree = {}
        pass

    def learn(self, X, y):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        # pass
        self.tree = self.learn_recursive(np.array(X, dtype=object), np.array(y, dtype=object))

    
    '''
    Building the tree (training) recursively
    '''
    def learn_recursive(self, X, y):

        row, col = X.shape
        # print row,col,' |  ',

        if (X.shape[0] == 1) or (np.all(y == y[0])):  # Recursion base-case
            return np.array([['null', y[0], None, None]], dtype=object)
        

        ### Finding the best split attribute and split value that maximizes the information gain (IG):
        maxIG = 0
        for j in range(col):
            split_column = X[:,j]
            for i in range(row):
                X_left, X_right, y_left, y_right  =  partition_classes(X, y, j, split_column[i])
                IG = information_gain(y, [y_left,y_right])
                if IG > maxIG:
                    maxIG           = IG
                    split_attribute = j
                    split_val       = split_column[i]
        # print "--> split_attribute = ",split_attribute,"  | split_value = ",split_val
        
        ### Continue with the best partition:
        X_left, X_right, y_left, y_right  =  partition_classes(X, y, split_attribute, split_val)
        # print len(X_left),len(X_right),len(y_left),len(y_right)

        # Recursion until reaching a leaf 
        left  = self.learn_recursive(X_left , y_left )
        right = self.learn_recursive(X_right, y_right)

        tree = np.array([[split_attribute, split_val, 1, left.shape[0] + 1]], dtype=object)
        tree = np.concatenate((tree, left ), axis = 0)
        tree = np.concatenate((tree, right), axis = 0)
        
        return tree



    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label

        def classify_recursive(record, tree):
            if tree.shape[0] == 1:  # Recursion base-case
                return tree[0][1]
            else:
                index = int(tree[0 ][0 ])
                node  = int(tree[0 ][-1])
                rec   = record[index]
                if isinstance(rec,  (float, long, int)) and (rec <= tree[0][1]): # numeric
                    return classify_recursive(record, tree[1:node])
                elif isinstance(rec, (str)) and (rec == tree[0][1]): # categorical
                    return classify_recursive(record, tree[1:node])
                else:
                    return classify_recursive(record, tree[node:])

        return classify_recursive(record, self.tree)


#################### TESTS #################### 
if __name__=='__main__':
    print "-------DECISION TREE TEST-------"
    X = list()
    y = list()
    XX = list()  # Contains data features and data labels
    numerical_cols = set([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]) # indices of numeric attributes (columns)

    # Loading data set
    with open("hw4-data.csv") as f:
        next(f, None)
        for line in csv.reader(f, delimiter=","):
            xline = []
            for i in range(len(line)):
                if i in numerical_cols:
                    xline.append(ast.literal_eval(line[i]))
                else:
                    xline.append(line[i])

            X.append(xline[:-1])
            y.append(xline[-1])
            XX.append(xline[:])

    # print len(X)
    # print len(y)


    dTree = DecisionTree()
    dTree.learn(X,y)

    Y_pred = []
    for record in X:
        Y_pred.append(dTree.classify(record))

    results = [prediction == truth for prediction, truth in zip(Y_pred, y)]
    accuracy = float(results.count(True)) / float(len(results))
    print 'Prediction Accuracy: {:.4f}'.format(accuracy)
    print "--------------------------------"
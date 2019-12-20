from scipy import stats
import numpy as np
from collections import Counter as yCount


# This method computes entropy for information gain
def entropy(class_y):
    # Input:            
    #   class_y         : list of class labels (0's and 1's)
    
    # TODO: Compute the entropy for a list of classes
    #
    # Example:
    #    entropy([0,0,0,1,1,1,1,1,1]) = 0.92
        
    ### First way:
    '''
    entropy = 0
    yLabels = yCount(class_y)   # counting the number of each label (0|1)

    for item in yLabels:
        probOfOccure = float(yLabels[item])/float(len(class_y)) # probability of occurance
        entropy += (-1) * probOfOccure * np.log2(probOfOccure) 
    '''

    ### More elegant way, by using stats: 
    yLabels, yCounts = np.unique(np.array(class_y), return_counts=True)
    return stats.entropy(yCounts, base=2)


def partition_classes(X, y, split_attribute, split_val):
    # Inputs:
    #   X               : data containing all attributes
    #   y               : labels
    #   split_attribute : column index of the attribute to split on
    #   split_val       : either a numerical or categorical value to divide the split_attribute
    
    # TODO: Partition the data(X) and labels(y) based on the split value - BINARY SPLIT.
    # 
    # You will have to first check if the split attribute is numerical or categorical    
    # If the split attribute is numeric, split_val should be a numerical value
    # For example, your split_val could be the mean of the values of split_attribute
    # If the split attribute is categorical, split_val should be one of the categories.   
    #
    # You can perform the partition in the following way
    # Numeric Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all
    #   the rows where the split attribute is less than or equal to the split value, and the 
    #   second list has all the rows where the split attribute is greater than the split 
    #   value. Also create two lists(y_left and y_right) with the corresponding y labels.
    #
    # Categorical Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all 
    #   the rows where the split attribute is equal to the split value, and the second list
    #   has all the rows where the split attribute is not equal to the split value.
    #   Also create two lists(y_left and y_right) with the corresponding y labels.

    '''
    Example:
    
    X = [[3, 'aa', 10],                 y = [1,
         [1, 'bb', 22],                      1,
         [2, 'cc', 28],                      0,
         [5, 'bb', 32],                      0,
         [4, 'cc', 32]]                      1]
    
    Here, columns 0 and 2 represent numeric attributes, while column 1 is a categorical attribute.
    
    Consider the case where we call the function with split_attribute = 0 and split_val = 3 (mean of column 0)
    Then we divide X into two lists - X_left, where column 0 is <= 3  and X_right, where column 0 is > 3.
    
    X_left = [[3, 'aa', 10],                 y_left = [1,
              [1, 'bb', 22],                           1,
              [2, 'cc', 28]]                           0]
              
    X_right = [[5, 'bb', 32],                y_right = [0,
               [4, 'cc', 32]]                           1]

    Consider another case where we call the function with split_attribute = 1 and split_val = 'bb'
    Then we divide X into two lists, one where column 1 is 'bb', and the other where it is not 'bb'.
        
    X_left = [[1, 'bb', 22],                 y_left = [1,
              [5, 'bb', 32]]                           0]
              
    X_right = [[3, 'aa', 10],                y_right = [1,
               [2, 'cc', 28],                           0,
               [4, 'cc', 32]]                           1]           
    ''' 

    X = np.array(X, dtype=object)
    y = np.array(y, dtype=object)
    
    # print X
    # print y

    split_column = np.array(X[:, split_attribute], dtype=object)

    index_left  = []
    index_right = []

    if np.issubdtype(np.array(list(split_column)).dtype, np.number):
        # print "Numeric"
        for i in range(0,len(split_column)):
            if split_column[i] <= split_val:
                # print X[i,:]
                index_left.append(i)
            else:
                # print X[i,:]
                index_right.append(i)
                
    else:
        # print "Categorical"
        for i in range(0,len(split_column)):
            if split_column[i] == split_val:
                # print X[i,:]
                index_left.append(i)
            else:
                # print X[i,:]
                index_right.append(i)


    X_left  = X[index_left ]
    X_right = X[index_right]
    
    y_left  = y[index_left]
    y_right = y[index_right]
    
    
    return (X_left, X_right, y_left, y_right)

    
def information_gain(previous_y, current_y):
    # Inputs:
    #   previous_y: the distribution of original labels (0's and 1's)
    #   current_y:  the distribution of labels after splitting based on a particular
    #               split attribute and split value
    
    # TODO: Compute and return the information gain from partitioning the previous_y labels
    # into the current_y labels.
    # You will need to use the entropy function above to compute information gain
    # Reference: http://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15381-s06/www/DTs.pdf
    
    """
    Example:
    
    previous_y = [0,0,0,1,1,1]
    current_y = [[0,0], [1,1,1,0]]
    
    info_gain = 0.45915
    """

    # IG = H - (HL*PL + HR*PR)

    H  = entropy(previous_y)

    HL = entropy(current_y[0])
    HR = entropy(current_y[1])
    PL = len(current_y[0])/float(len(previous_y))
    PR = len(current_y[1])/float(len(previous_y))

    info_gain = H - (HL*PL + HR*PR)

    return info_gain
    
#################### TESTS #################### 
if __name__=="__main__":
    print "--------- UTIL.PY TEST ---------"
    class_y = [0,0,0,1,1,1,1,1,1]
    print "class_y = ", class_y
    print ("ENTROPY(class_y) = %.3f" % entropy(class_y))

    print "--------------------------------"
    X = [[3, 'aa', 10],                
         [1, 'bb', 22],                      
         [2, 'cc', 28],                      
         [5, 'bb', 32],                      
         [4, 'cc', 32]]                  

    y = [1,1,0,0,1]
    
    X_left, X_right, y_left, y_right  =  partition_classes(X, y, 1, 'bb')
    print "x_left= "
    print X_left
    print "X_right= "
    print X_right
    print "y_left= "
    print y_left
    print "y_right= "
    print y_right

    print "--------------------------------"
    previous_y = [0,0,0,1,1,1]
    current_y = [[0,0], [1,1,1,0]]
    print "IG = ",information_gain(previous_y, current_y)



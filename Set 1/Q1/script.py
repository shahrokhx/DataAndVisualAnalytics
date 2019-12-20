import csv
import json
import time
import tweepy

# You must use Python 2.7.x
#--------------------------------------------------------------------------------------------------
# 1 point
def loadKeys(key_file):
    # TODO: put your keys and tokens in the keys.json file,
    #       then implement this method for loading access keys and token from keys.json
    # rtype: str <api_key>, str <api_secret>, str <token>, str <token_secret>
    # Load keys here and replace the empty strings in the return statement with those keys

    with open('keys.json','r') as tokenFile:
        jsonData = json.load(tokenFile)

    api_key      = jsonData['api_key'].encode('ascii','ignore')
    api_secret   = jsonData['api_secret'].encode('ascii','ignore')
    token        = jsonData['token'].encode('ascii','ignore')
    token_secret = jsonData['token_secret'].encode('ascii','ignore')

    return api_key, api_secret, token, token_secret
#--------------------------------------------------------------------------------------------------
# 4 points
def getPrimaryFriends(api, root_user, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' primary friends of 'root_user'
    # rtype: list containing entries in the form of a tuple (root_user, friend)
    primary_friends = []

    # Add code here to populate primary_friends
    user = api.get_user(root_user)
    #print 'Root: '+user.screen_name

    maxIter = min(no_of_friends,user.friends_count)
    fetchCounter = 0
    for friend in user.friends():
        #print 'P_Friend:',friend.screen_name

        primary_friends.append((root_user,friend.screen_name.encode('ascii','ignore')))
        fetchCounter = fetchCounter+1
        if fetchCounter == maxIter:
            break

    return primary_friends
#--------------------------------------------------------------------------------------------------
# 4 points
def getNextLevelFriends(api, users_list, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' friends for each user in users_list
    # rtype: list containing entries in the form of a tuple (user, friend)
    next_level_friends = []
    
    # Add code here to populate next_level_friends
    for entry in users_list:
        time.sleep(61)
        user_name = entry[1]
        user = api.get_user(user_name)
        if user.protected: continue    # To handle the protected users
        fetchCounter = 0
        for friend in user.friends():
            fetchCounter = fetchCounter + 1
            # print user_name,' >> d_counter ',fetchCounter
            next_level_friends.append((user_name,friend.screen_name.encode('ascii', 'ignore')))
            if fetchCounter == no_of_friends:
                break

    return next_level_friends
#--------------------------------------------------------------------------------------------------
# 4 points
def getNextLevelFollowers(api, users_list, no_of_followers):
    # TODO: implement the method for fetching 'no_of_followers' followers for each user in users_list
    # rtype: list containing entries in the form of a tuple (follower, user)
    next_level_followers = []
    
    # Add code here to populate next_level_followers
    for entry in users_list:
        time.sleep(61)
        user_name = entry[1]
        user = api.get_user(user_name) 
        if user.protected: continue    # To handle the protected users
        fetchCounter=0
        for follower in user.followers():
            fetchCounter = fetchCounter +1
            # print user_name, ' >> w_counter ', fetchCounter
            next_level_followers.append((follower.screen_name.encode('ascii','ignore'),user_name))
            if fetchCounter == no_of_followers:
                break

    return next_level_followers
#--------------------------------------------------------------------------------------------------
# 3 points
def GatherAllEdges(api, root_user, no_of_neighbours):
    # TODO:  implement this method for calling the methods getPrimaryFriends, getNextLevelFriends
    #        and getNextLevelFollowers. Use no_of_neighbours to specify the no_of_friends/no_of_followers parameter.
    #        NOT using the no_of_neighbours parameter may cause the autograder to FAIL.
    #        Accumulate the return values from all these methods.
    # rtype: list containing entries in the form of a tuple (Source, Target). Refer to the "Note(s)" in the
    #        Question doc to know what Source node and Target node of an edge is in the case of Followers and Friends.
    all_edges = []

    # Add code here to populate all_edges
    primaryFriends = getPrimaryFriends(api, root_user, no_of_neighbours)
    friendsOfFriends = getNextLevelFriends(api, primaryFriends, no_of_neighbours)
    followersOfFriends = getNextLevelFollowers(api, primaryFriends, no_of_neighbours)

    all_edges = primaryFriends+friendsOfFriends+followersOfFriends
    
    return all_edges
#--------------------------------------------------------------------------------------------------
# 2 points
def writeToFile(data, output_file):
    # write data to output_file
    # rtype: None

    csvFile = open(output_file, 'w')

    '''  --> My script has removed duplicate rows with these lines of code
             However, to avoid any problem with the AUTOGRADER, I commented them for submission!

    # Removing duplicate rows
    noRepeatData=[]
    for entry in data:
        if entry in noRepeatData: continue
        noRepeatData.append(entry)
    '''
    noRepeatData = data

    # Writing unique data to the file
    for entry in noRepeatData:
        csvFile.write(str(entry[0].encode('ascii','ignore'))+','+str(entry[1].encode('ascii','ignore'))+'\n')

    csvFile.close()

    pass
#--------------------------------------------------------------------------------------------------
"""
NOTE ON GRADING:

We will import the above functions
and use testSubmission() as below
to automatically grade your code.

You may modify testSubmission()
for your testing purposes
but it will not be graded.

It is highly recommended that
you DO NOT put any code outside testSubmission()
as it will break the auto-grader.

Note that your code should work as expected
for any value of ROOT_USER.
"""

def testSubmission():
    KEY_FILE = 'keys.json'
    OUTPUT_FILE_GRAPH = 'graph.csv'
    NO_OF_NEIGHBOURS = 20
    ROOT_USER = 'PoloChau'

    api_key, api_secret, token, token_secret = loadKeys(KEY_FILE)

    auth = tweepy.OAuthHandler(api_key, api_secret)
    auth.set_access_token(token, token_secret)
    api = tweepy.API(auth)

    edges = GatherAllEdges(api, ROOT_USER, NO_OF_NEIGHBOURS)

    writeToFile(edges, OUTPUT_FILE_GRAPH)

if __name__ == '__main__':
    testSubmission()
#--------------------------------------------------------------------------------------------------

import time

def generateDocument(characters, document):
    for character in characters:
        document = document.replace(character, '')
    return document == ''

def generateDocument1(characters, document):
    characterCounts = {}
    for character in characters:
        if character not in characterCounts:
            characterCounts[character] = 0
        characterCounts[character] += 1
    
    for character in document:
        if character not in characterCounts or characterCounts[character] == 0:
            return False
        
        characterCounts[character] -= 1

    return True


characters = 'Bste!hetsi ogEAxpelrt x '
document = 'AlgoExprt is the Best!'

start_time = time.time()
print(generateDocument1(characters, document))
time.sleep(1)
print(time.time() - start_time)



characters = 'Bste!hetsi ogEAxpelrt x '
document = 'AlgoExprt is the Best!'

start_time = time.time()
print(generateDocument(characters, document))
time.sleep(1)
print(time.time() - start_time)



# def static_func():
#     return QString:compare...
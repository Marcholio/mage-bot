import json

res = {}

with open('data/data.jsonl') as f:
  for line in f.readlines():
    msgData = json.loads(line)
    username = msgData["from"]["username"]
    if (username == "tyrkkom"):
      if ("text" in msgData):
        msg = msgData["text"].encode("utf-8", "ignore").replace("[^a-zA-Z\d\s:]", "")
        msg = msg.replace(".", "")
        if ("http" not in msg and "Europan lingues" not in msg):
          arr = msg.split(" ")
          print msg
          for i in range(len(arr)):
            w = arr[i]
            if w not in res:
              res[w] = []
            if i == len(arr) - 1:
              res[w].append("--END--")
            else:
              res[w].append(arr[i+1])

with open('data/parsed.json', 'w') as out:
  json.dump(res, out, encoding="utf-8")
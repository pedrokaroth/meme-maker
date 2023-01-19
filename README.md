# Image Analyzer

 Meme Maker project is a tool for creating memes. It allows users to add text to an image of their choice and save the result as a new image. The tool takes in an image file and text inputs, then using image processing libraries, specifically [GraphicsMagick](http://www.graphicsmagick.org/), it applies the text on the image and outputs the final meme image.


## Usage
 to use the this service you will need an account on aws and serverless framework.

### Deployment

In order to deploy the example, you need to run the following command:

```
$ sls deploy
```

After running deploy, you should see output similar to:

```bash
Deploying meme-maker to stage dev (us-east-1)

✔ Service deployed to stack meme-maker-dev (64s)

endpoint: GET - https://krghgmd9s8.execute-api.us-east-1.amazonaws.com/dev/mememake
functions:
  mememake: meme-maker-dev-mememake (995 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
npm run mememake
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "headers": {
        "Content-Type": "text/html"
    },
    "body": "<img src=\"data:image/png;base64,..."/>"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
npm run offline
```

Which should result in response similar to the following:

```bash
Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
           * mememake: meme-maker-dev-mememake

   ┌────────────────────────────────────────────────────────────────────────────┐
   │                                                                            │
   │   GET | http://localhost:3000/dev/mememake                                 │
   │   POST | http://localhost:3000/2015-03-31/functions/mememake/invocations   │
   │                                                                            │
   └────────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

### Query Parameters

- **image**: (optional) path to the image you want to use as a base for the meme.
- **top**: (optional) text you want to add to the top of the image.
- **bottom**: (optional) text you want to add to the bottom of the image.


### Example

[https://krghgmd9s8.execute-api.us-east-1.amazonaws.com/dev/mememake?image=https://s5.static.brasilescola.uol.com.br/be/2022/10/meme-joelma.jpg&top=top%20text&bottom=bottom%20text](https://krghgmd9s8.execute-api.us-east-1.amazonaws.com/dev/mememake?image=https://s5.static.brasilescola.uol.com.br/be/2022/10/meme-joelma.jpg&top=top%20text&bottom=bottom%20text)
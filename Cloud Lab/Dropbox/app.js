const express = require('express');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const multer = require('multer');
const upload = multer();
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

const dropbox = new Dropbox({
    accessToken: 'sl.CBVAgg0Lb6-5zaww4dkQpK2KZcIhNixGkjIMyu9NDt4nFegdntMFPZQVPT6K2zCZ51YeFn2yvb7SGFR6bSxiRqU4NIJGyJnZ2BDH3-VC6FUP7VCJwBzmdiC3vsZGdHv7XNRHju3lNvkT',
    fetch
});

app.get('/', (req, res) => {
    res.render('index');  
});


app.post('/upload-file', upload.single('file'), (req, res) => {
    const fileContent = req.file.buffer;
    dropbox.filesUpload({ path: `/${req.file.originalname}`, contents: fileContent })
        .then(() => res.send('File uploaded to Dropbox'))
        .catch(err => res.status(500).send(err));
});

app.get('/download-file', (req, res) => {
    const fileName = req.query.fileName;
    dropbox.filesDownload({ path: `/${fileName}` })
        .then(response => {
            res.set({
                'Content-Type': response.result['.tag'] === 'file' ? response.result.name.split('.').pop() : 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${response.result.name}"`
            });
            res.send(response.result.fileBinary);
        })
        .catch(err => res.status(500).send(err));
});

app.listen(3000, () => {
    console.log('Dropbox server is running on port 3000');
});

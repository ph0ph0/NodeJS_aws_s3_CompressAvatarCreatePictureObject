rm index.zip
cd package
zip -X -r "../index.zip" *
cd ..
aws lambda update-function-code --function-name CompressAvatarCreatePictureObject-dev --zip-file fileb://index.zip

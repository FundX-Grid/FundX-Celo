#!/bin/bash

read -p "Commit message: " msg
read -p "Push where? (origin | secondary | backup | mirror | all): " target

git add .
git commit -m "$msg"

if [ $? -eq 0 ]; then
  git push origin main
else
  echo "❌ Commit failed. Fix issues and retry."
fi


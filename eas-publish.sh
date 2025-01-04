#!/bin/bash

# Function to extract branches from eas.json under the build section
get_branches() {
    branches=$(jq -r '.build | to_entries[] | [.key] | @tsv' eas.json)
    echo "$branches"
}

available_branches=$(get_branches)

# Use gum choose to select a branch
selected_branch=$(echo "$available_branches" | gum choose)
echo "Selected branch: $selected_branch"

echo "Do you want to:"
echo "1. Enter a custom message"
echo "2. Choose from the latest 5 commit messages"

message_option=$(gum choose "Enter a custom message" "Choose from the latest 5 commit messages")

if [ "$message_option" == "Enter a custom message" ]; then
    # Use gum input to enter a custom message
    message=$(gum input --placeholder "Enter the message")
elif [ "$message_option" == "Choose from the latest 5 commit messages" ]; then
    # Use gum spin to show a loading spinner while fetching the latest commit messages
    commit_messages=$(gum spin --show-output --title "Fetching latest commit messages" -- git log --format=%B -n 5 | sed '/^$/d')
    # Use gum choose to select from the latest commit messages
    message=$(echo "$commit_messages" | gum choose)
else
    echo "Invalid choice. Exiting."
    exit 1
fi

echo "---------------------------------------------------------------------"
echo " { ~Summary~ }"
echo " Branch: $selected_branch"
echo " Message: $message"
echo "[---------------------------------------------------------------------"
# Use gum confirm to confirm the update
gum confirm "Proceed with the update?" && eas update --branch $selected_branch --message "$message" || echo "Update canceled."

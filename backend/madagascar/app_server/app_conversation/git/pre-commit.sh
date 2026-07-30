#!/bin/bash
# This hook was installed by Madagascar
# It calls the pre-commit script in the .madagascar directory

if [ -x ".madagascar/pre-commit.sh" ]; then
    source ".madagascar/pre-commit.sh"
    exit $?
else
    echo "Warning: .madagascar/pre-commit.sh not found or not executable"
    exit 0
fi

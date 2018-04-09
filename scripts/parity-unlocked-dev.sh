#!/bin/bash

parity --config dev --unlock 0x00a329c0648769A73afAc7F9381E08FB43dBEA72 --password scripts/parity.passwords --force-ui  --jsonrpc-cors all -lrpc=trace --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts  --no-persistent-txqueue

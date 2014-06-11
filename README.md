E0_Server
=========

Server for viewing state of E0 clients

Goes with Edderick's E0_Go and E0_Python repos

Interface for clients:

domain:port/masterDetails?kcmaster=xyz&admaster=xyz&clmaster=xyz
For sending initialization details to the server:
* Master Kc
* Master Address
* Master Clock (26 bits)

domain:port/plainText?role=xyz&content=xyz
where role is "master" or "slave"
For sending plaintext to the server

domain:port/keystream?role=xyz&content=xyz
where role is "master" or "slave"
For sending keystreams to the server
(there's also a second function, ask Ed about this)

domain:port/cipherText?role=xyz&content=xyz
where role is "master" or "slave"
For sending ciphertext to the server

port is hardcoded, it is 8000

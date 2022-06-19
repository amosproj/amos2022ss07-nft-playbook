# Middleware
The middleware is a layer that is situated in between the frontend and backend. On one hand side it's use is to abstract from the backend, so that the frontend does not have to cope with the backend's complexity and on other hand it enables the frontend to store the users inputs at a central location, the so called `SettingsData.ts`.

When the frontend wants to call a backend functionality it can do so, by using the corresponding interfaces provided by the middleware. The middleware will then retrieve all necessary information from its central datastructure. This data is then used to execute the blockchain specific operation on the backend. If threre is a result, it is passed backed to the frontend when necessary. 

Another functionality provided by the middleware, is the `PinataClient.ts`. It enables the user to easily upload files to the **I**nter **P**lanetary **F**ile **S**ystem IPFS. To guarantee the persistent Pinning/Accessibility of the image, through IPFS, we use the so called Pinata Service.

## SettingsData.ts
The middleware uses a central datastructure which is composed of a dict of SettingsData-Objects that are mapped to a specific blockchain. Each SettingsData-Object stores a multitude of information for a blockchain like for example **user_private_key**, **blockchain_entry_point** , etc..

The frontend is able to store those values by using **setter-functions** provided by this middleware. When the frontend needs to access those values (for example for validation purposes), it can do so by using corresponding **getter-functions**.

## PinataClient.ts
This service can be addressed by the frontend using the following function: **upload_image()**. This function receives the local file path to an image as a parameter and creates a filestream, which is then passed to the pinataSDK. This SDK then uses **API_KEYS**, provided by the user, to authenticate at the pinata endpoint. After authentification the image is uploaded and pinned by pinata so that it can persistently be accessed through the gloabl IPFS network.
TẢI GANACHE , trỏ file config là file truffle init 
Lên remix solidity, upload contract lên 

![image](https://user-images.githubusercontent.com/74479681/231015138-a7ef7ddf-ac5f-42d1-938f-89cbe3e1c260.png)

Tiếp đó chọn đến trang compile và ấn compile 
 
 THực hiện deploy bằng cách đến trang deploy,ở mục enviroment chọn DEV-GANACHE_PROVIDER 
  
 ![image](https://user-images.githubusercontent.com/74479681/231015344-93e44f13-c5c1-4523-a99e-83f4c9a0d52d.png)
 
 ấn deploy 
 
 ![image](https://user-images.githubusercontent.com/74479681/231015463-fa0d74fb-3010-4bc5-b1b1-71fdd4344d3f.png)

tại dòng SUPPLYCHAIN AT ấn copy ( đây là địa chỉ của contract )  

copy nó lại và dán vào dòng public_contract_adddress tại file evn trong client.

Cài đặt các file cần thiết trong client 

Thực hiện chạy


Anh có thể tìm hiểu về đầu ra vào của dữ liệu ở REMIX DEPLOY 

![image](https://user-images.githubusercontent.com/74479681/231015908-55912a03-d993-4eb7-9335-b1469abf4e32.png)

và viết hàm lấy dữ liệu từ contract tại file context trong client.

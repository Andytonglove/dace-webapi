## 实验二-dace
### 个人信息采集

1. 实验目的
本实验考察学生对Web Service理论掌握的情况，通过⼀个具体的Web应用的前后端编写，实现相应的REST风格Web API，服务于前端网页、以及各种API调用。通过该实验过程，学生可以了解REST架构风格的特点、集合类资源的Web API设计方式、以JSON为格式的表述方法，从而加深对Web Service理论的理解。

2. 实验要求
    1. 编写网页前端，实现对⼈员信息的基本采集，包括：姓名、学号、邮箱、手机号码、个人兴趣，共5项内容。其中，对学号、邮箱、手机号码应采取正则匹配验证（服务端或\客户端验证，自行选择），对姓名、个人兴趣采取字符长度限制（姓名不超过8个中文字符，个人兴趣不超过32个中文字符，自行选择采取服务端或客户端验证）。
    2. 网页端页面流转逻辑参照课堂上所讲的 <b>YOUTYITWEPOSTIT</b> 网站逻辑。
    3. 编写客户端App代码，以独立应用程序的方式完成相应的功能……
    4. 编写服务端代码，以响应前端的请求。服务端除响应前端的网页请求外，还以API方式提供相应的服务……
    5. 信息资源以JSON方式组织，对信息条目的新增、删除、修改支持模版方式。（参照collection+json，自行定义资源模版）
    6. 本实验不限定所采用的编程语言，学生可以根据个人的偏好，自行选择。实验所准备的代码仅供参考。
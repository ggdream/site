# backend

## 一、板块划分
- [x] 安全板块
- [x] 聊天板块
- [x] 用户板块
- [x] 网盘板块


## 二、功能设计
### 1.安全板块
- 注册、登录、密码管理
- 网盘设备签名
- 聊天环境验证

### 2.聊天板块
- 单聊、群聊
- 语音通话
- 视频通话
- 支持发送传输文本、二进制文件
- 保留七天聊天消息

### 3.用户板块
- 个人信息的设置和获取
- 应用相关信息的设置
- 添加、删除和查看好友

### 4.网盘板块
- 上传、查看、查询、下载、删除文件
- 分享文件


## 三、技术栈支撑
### 1.安全板块
- 身份认证：JWT+Session+Redis
- 设备签名：自定义算法，获取设备信息，用一定规则生成DeviceID+Redis
- 环境验证：自定义算法，获取设备信息及时间戳生成Signature

### 2.聊天板块
- 消息存储：Redis+MySQL

### 3.用户板块
- 个人信息和应用配置：MySQL
- CURD好友：Redis+MySQL

### 4.网盘板块
- 上传、删除文件：MySQL
- 查看、下载、分享文件：Redis+MySQL
- 查询文件：ElasticSearch+Redis


## 四、控制器设计
### 1.安全板块
1. 用户注册-申请
~~~
手机号或邮箱、环境验证码
临时票据

1.验证环境验证码（不正常则返回）
2.验证该手机号或邮箱是否已经注册过（已注册则返回）
3.验证是否在60s内Redis里是否有记录（有则返回）
4.生成临时票据和短信验证码，存储临时票据->`短信验证码:手机号`至Redis（3min）
5.调用验证码发送接口，在Redis里设置60s（发送期限），返回临时票据
~~~

2. 用户注册-确认
~~~
临时票据、验证码
登陆票据

1.以临时票据作为key，从Redis里读取验证码并比对（没有Key则异常返回;不一致则删除原有临时票据并返回，让客户端重新发送验证码）
2.读取出验证码中的手机号，自动向MySQL设置该用户的随机初始信息，得到uid
3.在Redis里删除原有临时票据(Deprecated)
4.生成登陆票据，以token->uid存储至Redis，返回登陆票据
~~~

3. 用户登录-验证码-第一次申请验证码
~~~
手机号或邮箱、环境验证码
临时票据

1.验证环境验证码（不正常则返回）
2.验证该手机号或邮箱是否已经注册过（未注册则返回）
3.生成临时票据和短信验证码，存储临时票据->`短信验证码`至Redis（3min）
4.调用验证码发送接口，在Redis里设置60s（发送期限），返回临时票据
~~~

4. 用户登录-验证码-获取Token
~~~
临时票据、验证码
登陆票据

1.以临时票据作为key，从Redis里读取验证码并比对（没有Key则异常返回;不一致则删除原有临时票据并返回，让客户端重新发送验证码）
2.在Redis里删除原有临时票据(Deprecated)
3.生成登陆票据，以token->uid存储至Redis，返回登陆票据
~~~

5. 用户登录-密码
~~~
手机号或邮箱、密码
登录票据

1.读取MySQL，判断账号和密码是否匹配，获取uid
2.生成登陆票据，以token->uid存储至Redis，返回登陆票据
~~~

### 2.聊天板块
#### 1.PC端+网页端（Websocket协议）
1. 接入
~~~
登录票据、环境验证码
if error：票据过期或环境效验失败
~~~

2. 通信消息外层
~~~yaml
type: Enum
data: String
version: Int
sinature: String
~~~

3. 通信消息类别
~~~yaml
# 普通消息
to: Int(uid)
text: String

# 图片消息
to: Int(uid)
url: String

# 视频消息
to: Int(uid)
url: String

# 全量同步
Array[]:
    from: Int(uid)
    time: String
    type: Int(Enum -> Int)
    message: String

# 增量同步
mid: String
from: Int(uid)
text|url: String

# 好友申请
uid: String
username: String
datetime: String    # 申请的时间
sex: String
avatar: String
message: String     # 附带消息
~~~

#### 2.移动端（私有协议）
TODO: 调研Dart对tcp和tls的支持情况

#### 3.聊天文件
1. 文件上传
~~~
登录票据、文件流
文件网络地址、文件类型、文件序列号（压缩地址和原分辨率地址）（如果是图片为压缩后的图片；如果是视频，则为缩略图地址；如果是其他类型文件，则只返回模糊地址即真实地址）

1.以流的方式保存文件
2.读前512字节，分析文件类型
3.按文件类型，进行对应的操作
4.设置消息入库，设置Redis7天缓存
5.利用传输协议推送消息到指定用户
6.返回消息
~~~

2. 转存至网盘
~~~
登陆票据、文件序列号、文件目录

1.验证文件序列号是否存在（不存在则返回）
2.存在则存储到个人
3.返回
~~~

### 3.用户板块
1. 获取个人基本信息
~~~
uid
uid、昵称、头像地址

1.利用uid查询
2.有结果则返回数据，无结果则返回errno
~~~

2. 获取个人信息
~~~
uid
uid、昵称、头像地址、性别、出生年月日、所在城市、签名、邮箱

1.利用uid查询
2.有结果则返回数据，无结果则返回errno
~~~

3. 设置个人头像
~~~
登录票据、头像文件
头像地址

1.以流形式接收文件，保存或覆盖原有文件
2.返回处理情况
~~~

4. 设置个人信息
~~~
昵称、头像地址、性别、出生年月日、所在城市、签名、邮箱
昵称、头像地址、性别、出生年月日、所在城市、签名、邮箱

1.验证各字段格式
2.入库
3.成功则返回存储后的结果，失败则返回errno
~~~

5. 搜索用户
~~~yaml
搜索类型（uid或用户名）、输入的字段、精准匹配
Array[]:
    uid: Int
    username: String
    avatar: String
    sex: String
    motto: String

1.根据参数类型进行对应的ElasticSearch查询（20条）
2.返回数据
~~~

6. 申请好友位
~~~
对方的uid

1.入MySQL存储记录
2.放置消息推送队列
3.返回处理结果
~~~

7. 删除好友
~~~
对方的uid

1.删库
2.返回处理结果
~~~

8. 查看好友
~~~yaml
当前位置、查看数量
Array[]:
    uid: Int
    username: String
    avatar: String
    sex: String
    motto: String

1.查库
2.返回结果
~~~

### 4.网盘板块
1. 上传文件-单文件
~~~
文件、环境签名
文件序列号、文件所属路径

1.验证环境签名（不正常则返回）
2.以流形式保存文件
3.将记录写入数据库
4.返回结果
~~~

2. 删除文件
~~~
文件序列号、环境签名

1.验证环境签名（不正常则返回）
2.删库
3.返回结果
~~~

3. 分享文件
~~~
文件目录序列、有效期限、有无密码
文件地址、密码

1.设置Redis键值对（文件目录序列）
2.返回结果
~~~

4. 查看文件
~~~yaml
文件目录序列

isDir: Boolean
name: String
counter: Int    # 子项目数量（不记录孙级）
children?: []   # occurs if isDir equals true
atime: String
mtime: String
ctime: String
~~~

5. 下载文件-获取文件目录结构
~~~yaml
文件序列号、密码、环境签名

isDir: Boolean
name: String
counter: Int    # 子项目数量（不记录孙级）
children?: []   # occurs if isDir equals true
atime: String
mtime: String
ctime: String

返回临时票据，下载验证使用
~~~

6. 下载文件-下载指定内容
~~~yaml
文件序列号（Array）、环境签名、临时票据
Array[]:
    - index: String # 文件序列号
      url: String   # 临时的外链
~~~

7. 查询文件
~~~yaml
文件名字
isDir: Boolean
path: String
name: String
atime: String
mtime: String
ctime: String
~~~

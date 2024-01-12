from ultralytics import YOLO
import cv2
import os
import shutil
#v8を使う
model = YOLO("yolov8x.pt") 

#写真そのもの
#C:\yolopy\imagesに入れたらいい
image = "ceatec-mitiru.jpg"
#写真のパス
imgpass = "runs/detect/predict/" + image


#写真に人数を入れる
def Writepeople():
    img = cv2.imread(imgpass)
   
   #画像に人数を描写
    cv2.putText(img,
                text="people  "+str(result[0].boxes.data.shape[0]),
                org=(10, 100),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=3.0,
                color=(0, 0, 255),
                thickness=2,
                lineType=cv2.LINE_4)
    #"ここが保存場所"
    cv2.imwrite(imgpass, img)
 
try: 
    # 前の写真を削除
    if os.path.isfile(imgpass) :
        shutil.rmtree("runs/")
        
    #ここで人を判定    
    result = model("images/"+image, save=True ,classes=[0], conf=0.3) 
    NumOfPeople =result[0].boxes.data.shape[0]
    print(NumOfPeople)

    Writepeople()

    # #画像に人数を描写
    # cv2.putText(img,
    #             text="people  "+str(result[0].boxes.data.shape[0]),
    #             org=(10, 100),
    #             fontFace=cv2.FONT_HERSHEY_SIMPLEX,
    #             fontScale=3.0,
    #             color=(0, 0, 255),
    #             thickness=2,
    #             lineType=cv2.LINE_4)
    # #"ここが保存場所"
    # cv2.imwrite(imgpass, img)

except Exception as e:
    print(f"エラー：{e}")
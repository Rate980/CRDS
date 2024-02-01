from ultralytics import YOLO
import time
import os
import shutil
#v8を使う
model = YOLO("yolov8x.pt") 

# 写真の受け取り処理
def ReceivePhoto(img):

    # 写真のパス
    imgpass = "runs/detect/predict/" + img
    resultImagePass = "result/images/" + img

    try: 
        # # 前の写真を削除
        # if os.path.isfile(imgpass):
        #     os.remove(imgpass)
        #     # ファイルが削除されるまで待機
        #     while os.path.exists(imgpass):
        #         time.sleep(1)
        
        #ここで人を判定
        result = model("images/"+img, save=True ,classes=[0], conf=0.3)

        NumOfPeople =result[0].boxes.data.shape[0]

        if os.path.isfile(imgpass):
            # ファイルを移動
            shutil.move(imgpass, resultImagePass)

            # ファイルが移動されるまで待機
            while os.path.exists(imgpass):
                time.sleep(1)
            # フォルダー削除
            shutil.rmtree("runs")

        return NumOfPeople

    except Exception as e:
        print(f"エラー：{e}")


if __name__ == "__main__":
    image = "person.jpg"
    res = ReceivePhoto(image)

    print(f"結果：{res}人")
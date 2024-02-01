# API
from fastapi import BackgroundTasks, FastAPI
from fastapi import File, UploadFile
from fastapi.responses import FileResponse
# YOLO
from YoloCountPerson import ReceivePhoto

# import datetime
from firebase import venue, update

app = FastAPI()

# ファイルの保存名作成
def naming():
    building = "3"
    floor = "2F"
    image_name = f"{building}_{floor}.jpg"

    return image_name, building+"号館", floor

# BackgroundTask(YOLO)
def countPerson(img_name, building, floor):
    
    # YOLOで人数検知
    person = ReceivePhoto(img_name)

    print(f"b:{building},f:{floor},p:{person}")

    update(building, floor, person)
    

@app.get("/")
async def root():
    return {"person": "人数"}

# 画像を送る
@app.post("/upload")
async def uploadFile(background_tasks:BackgroundTasks,file: UploadFile = File(...)):

    # 元画像の保存先
    img_name, building, floor = naming()
    save_path = f"images/{img_name}"
    print(save_path)

    # 保存
    with open(save_path, "wb") as f:
        f.write(file.file.read())

    # YOLOを実行
    background_tasks.add_task(countPerson, img_name, building, floor)

    return {"person": "Execute YOLO"}

# 画像を返す
@app.get("/req/img/{imgName}")
async def getImage(imgName:str):
    image_path = f"result/images/{imgName}.jpg"
    return FileResponse(image_path)

# データベースを返す
@app.get("/api/req/datas")
async def resData():
    return {"data": "data"}


# uvicorn main:app --reload
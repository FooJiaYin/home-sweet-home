# Software Studio 2019 Spring Assignment 2

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Complete game process|15%|Y|
|Basic rules|20%|Y|
|Jucify mechanisms|15%|Y|
|Animations|10%|Y|
|Particle Systems|10%|Y|
|UI|5%|Y|
|Sound effects|5%|Y|
|Leaderboard|5%|Y|

## Website Detail Description

# Basic Components Description : 
1. Complete game process : <br>
    boot->load->menu->play->win/lose
2. Basic rules :<br>
    player - 單人時方向鍵控制，雙人時wasd控制1p，方向鍵控制2p，自動射擊<br>
    enemy - 自動移動並射擊<br>
    map - 自動捲動直到boss出現
3. Jucify mechanisms : <br>
    level - 三關，每分鐘一關，在遊戲畫面顯示x/3，單人模式在右上角，雙人模式在右下角<br>
     [lv2 敵人移動射擊加速、大型敵方飛船生出速加快]<br>
     [lv3 敵人移動射擊再加速、出現艦隊]（稍微限制移動範圍以提高難度）<br>
    skill - 點擊skill字樣觸發，消除畫面中所有敵人（對boss無效）
4. Animations :<br>
    player - 飛行動畫、擊毀爆炸動畫<br>
    enemy - 擊毀爆炸動畫
5. Particle Systems : 子彈射中對手時播放
6. UI : <br>
    player health - 遊戲畫面右上角，初始為5，被擊中扣一，被撞歸零，歸零時死亡<br>
    skill number - 遊戲畫面左下角，初始為3<br>
    score - 遊戲畫面右上角<br>
    game pause - 遊戲畫面左上角<br>
    setting - 主畫面左下，可選遊戲模式與控制音樂、音效的音量
7. Sound effects : <br>
    背景音樂、射擊音效、爆炸音效、獲得道具音效、通關音效、失敗音效
8. Leaderboard : <br>
    主畫面右上，顯示單人與雙人模式前五名

# Bonus Functions Description : 
1. Multi-player game : off-line
2. Enhanced items : <br>
    unique bullet - 吃到子彈降落傘後升級子彈等級，最多一次5發，被擊中降級<br>
    little helper - 吃到飛機降落傘後左右出現小飛機幫忙攻擊，10秒消失<br>
     [限單人模式]（雙人+小幫手清怪太快）
3. Boss : <br>
    巨型飛船，一次產生多個可追蹤玩家的小型敵人，隨時間上下移動壓縮玩家空間

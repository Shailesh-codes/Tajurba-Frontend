<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./public/Styles/style.css" />
  </head>
  <body>
    <div class="TempContainer">
      <div class="subCont">
        <div class="MDPname" id="userName"><?php echo htmlspecialchars($_GET['name']); ?></div>
        <div class="MDPdate" id="certDate">Date: <?php echo htmlspecialchars($_GET['date']); ?></div>
        <img class="TempImage" src="./public/assets/mdpImage.jpg" alt="" />
      </div>
    </div>
  </body>
</html>

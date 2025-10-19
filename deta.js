if(!localStorage.getItem("questions")){
  const initData = [
    {subject:"社会",question:"日本の首都は？",choices:["大阪","東京","京都","札幌"],answer:"東京",point:10},
    {subject:"古文",question:"『いと』の意味は？",choices:["とても","少し","すぐに","あまり"],answer:"とても",point:10}
  ];
  localStorage.setItem("questions", JSON.stringify(initData));
}

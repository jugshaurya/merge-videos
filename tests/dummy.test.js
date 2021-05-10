const list = [
  "alpha/1.q",
  "alpha/10. sad",
  "alpha/11.aewqe",
  "alpha/12.saw",
  "alpha/13.wrer",
  "alpha/14.asd",
  "alpha/15.wqe",
  "alpha/16.sad",
  "alpha/17.awq",
  "alpha/2.as23",
  "alpha/3.dvc",
  "alpha/4.fgg",
  "alpha/5.fgh",
  "alpha/6.wqe",
  "alpha/7.waqewq",
  "alpha/8.wqawq",
  "alpha/9.oip",
].sort((a, b) => {
  const splittedString = a.split("/");
  const alpha = splittedString[splittedString.length - 1];

  const splittedStringb = b.split("/");
  const betta = splittedStringb[splittedStringb.length - 1];
  return parseInt(alpha.split(".")[0]) - parseInt(betta.split(".")[0]);
});

console.log(list);

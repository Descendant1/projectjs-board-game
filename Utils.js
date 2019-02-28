getRandomNext = (min, max) =>
{
    return parseInt(Math.random() * (max - min) + min);
}
throwDice = () =>
{
    return getRandomNext(1,6) + getRandomNext(1,6) + getRandomNext(1,6);    
}
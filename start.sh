cd ./application
npm run build

max=${1:-3}
echo "starting 3 application instances"
for i in `seq $max`
do
  (PORT=300$i npm run serve) &
done

wait
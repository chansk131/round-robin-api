cd ./application
npm run build

max=${1:-3}
all_ports=""
echo "starting $max application instances"
for i in `seq $max`
do
  port="300$i"
  if [[ $all_ports -eq "" ]]; then all_ports="$port"; else all_ports="${all_ports},${port}"; fi
  (PORT=$port npm run serve) &
done

cd ../round-robin-api
npm run build
echo "starting round robin api"
(PORT=8080 APPLICATION_URL=http://localhost ALL_PORTS=$all_ports npm run serve) &

wait
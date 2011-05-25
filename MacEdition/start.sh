if [ -n "$1" ]; then
	port=$1
else
	port=9999
fi
jvmid=`ps -a | grep "OKBuzzer.jar" | grep -v grep | awk "{print $1}"`
if [ -n "$jvmid" ]; then
	kill -9 $jvmid
	sleep 3
fi

java -jar OKBuzzer.jar $1&
sleep 3

while true; do
	jvmid=`ps -a | grep "OKBuzzer.jar" | grep -v grep | awk "{print $1}"`
	if [ -z "$jvmid" ]; then
		sleep 3
	else 
		echo "OKBuzzer is running at http://127.0.0.1:$port/"
		open -a Portable\ Firefox\ OS\ X/Portable\ Firefox http://127.0.0.1:$port/&
		break
	fi
done

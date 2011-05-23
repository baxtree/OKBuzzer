java -jar OKBuzzer.jar $1&
sleep 3

while true; do
	JVMID = `ps -a | grep "/usr/bin/java" | grep -v grep | awk '{print $1}'`
	if [ -z "$JVMID" ]; then
		sleep 3
	else 
		echo "OKBuzzer is running at http://127.0.0.1:$1"&
		open -a Portable\ Firefox http://127.0.0.1:$1/
		break
	fi
done
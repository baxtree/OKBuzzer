@echo off
if not !%1==! (
	start jre\bin\java -jar OKBuzzer.jar %1
) else (
	start jre\bin\java -jar OKBuzzer.jar
)
sleep 3
if not !%1==! (
	echo "OKBuzzer is running at http://127.0.0.1:%1%"
	FireFoxPortable\FirefoxPortable.exe http://127.0.0.1:%1/
) else (
	echo "OKBuzzer is running at http://127.0.0.1:9999"
	FireFoxPortable\FirefoxPortable.exe http://127.0.0.1:9999/
)

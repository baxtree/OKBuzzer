call jre\bin\java -jar OKBuzzer.jar 
sleep 3
call echo "OKBuzzer is running at http://127.0.0.1:%1"
call FirefoxPortable_4.0.1_English.paf.exe -fullscreen http://127.0.0.1:%1/

package net.okbuzzer;

import org.mortbay.jetty.Handler;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.DefaultHandler;
import org.mortbay.jetty.handler.HandlerList;
import org.mortbay.jetty.handler.ResourceHandler;

public class OKBuzzerRunner {

	public static void main(String[] args) throws Exception {
		int port = 9999;
		if (args.length >= 1)
			port = Integer.parseInt(args[0]);
		Server server = new Server(port);
		ResourceHandler resource_handler = new ResourceHandler();
		resource_handler.setResourceBase(args.length == 2 ? args[1] : ".");
		HandlerList handlers = new HandlerList();
		handlers.setHandlers(new Handler[] { resource_handler,
				new DefaultHandler() });
		server.setHandler(handlers);
		server.start();
		server.join();
	}
}

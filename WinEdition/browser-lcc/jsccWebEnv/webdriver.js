var webdriver_t = 	"##HEADER##\n"+
					"\n"+
					"/*\n"+
					"\tJS/CC: A LALR(1) Compiler-Compiler written in JavaScript\n"+
					"\tCopyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer\n"+
					"\thttp://www.jmksf.com ++ jscc<-AT->jmksf.com\n"+
					"\t\n"+
					"\tFile:\tjscc.html\n"+
					"\tAuthor:\tJan Max Meyer\n"+
					"\tUsage:\tModified parser template for the Web Environment Module\n"+
					"\t\t\tBased on \"driver_web.js_\" parser template, but NOT in the public domain!\n"+
					"\t\n"+
					"\tYou may use, modify and distribute this software under the terms and conditions\n"+
					"\tof the Artistic License. Please see ARTISTIC for more information.\n"+
					"\n"+
					"\tDriver for the JS/CC Web Environment with integrated HTML parse tree generator!\n"+
					"\t\n"+
					"\tFeatures:\n"+
					"\t- Parser trace messages\n"+
					"\t- Integrated panic-mode error recovery\n"+
					"\t- Parse tree construction for the JS/CC web environment\n"+
					"*/\n"+
					"\n"+
					"var ##PREFIX##_dbg_withtrace\t\t= false;\n"+
					"var ##PREFIX##_dbg_string\t\t\t= new String();\n"+
					"\n"+
					"function __##PREFIX##dbg_print( text )\n"+
					"{\n"+
					"\t##PREFIX##_dbg_string += text + \"\\n"+
					"\";\n"+
					"}\n"+
					"\n"+
					"function __##PREFIX##lex( info )\n"+
					"{\n"+
					"\tvar state\t\t= 0;\n"+
					"\tvar match\t\t= -1;\n"+
					"\tvar match_pos\t= 0;\n"+
					"\tvar start\t\t= 0;\n"+
					"\tvar pos\t\t\t= info.offset + 1;\n"+
					"\n"+
					"\tdo\n"+
					"\t{\n"+
					"\t\tpos--;\n"+
					"\t\tstate = 0;\n"+
					"\t\tmatch = -2;\n"+
					"\t\tstart = pos;\n"+
					"\n"+
					"\t\tif( info.src.length <= start )\n"+
					"\t\t\treturn ##EOF##;\n"+
					"\n"+
					"\t\tdo\n"+
					"\t\t{\n"+
					"\n"+
					"##DFA##\n"+
					"\t\t\tpos++;\n"+
					"\n"+
					"\t\t}\n"+
					"\t\twhile( state > -1 );\n"+
					"\n"+
					"\t}\n"+
					"\twhile( ##WHITESPACE## > -1 && match == ##WHITESPACE## );\n"+
					"\n"+
					"\tif( match > -1 )\n"+
					"\t{\n"+
					"\t\tinfo.att = info.src.substr( start, match_pos - start );\n"+
					"\t\tinfo.offset = match_pos;\n"+
					"\t\t\n"+
					"##TERMINAL_ACTIONS##\n"+
					"\t}\n"+
					"\telse\n"+
					"\t{\n"+
					"\t\tinfo.att = new String();\n"+
					"\t\tmatch = -1;\n\t}\n\n\treturn match;\n}\n\n\nfunction __##PREFIX##parse( src, err_off, err_la )\n{\n\tvar\t\tsstack\t\t\t= new Array();\n\tvar\t\tvstack\t\t\t= new Array();\n\tvar \terr_cnt\t\t\t= 0;\n\tvar\t\tact;\n\tvar\t\tgo;\n\tvar\t\tla;\n\tvar\t\trval;\n\tvar \tparseinfo\t\t= new Function( \"\", \"var offset; var src; var att;\" );\n\tvar\t\tinfo\t\t\t= new parseinfo();\n\t\n\t//Visual parse tree generation\n\tvar \ttreenode\t\t= new Function( \"\", \"var sym; var att; var child;\" );\n\tvar\t\ttreenodes\t\t= new Array();\n\tvar\t\ttree\t\t\t= new Array();\n\tvar\t\ttmptree\t\t\t= null;\n\t\n##TABLES##\n\n##LABELS##\n\t\n\tinfo.offset = 0;\n\tinfo.src = src;\n\tinfo.att = new String();\n\t\n\tif( !err_off )\n\t\terr_off\t= new Array();\n\tif( !err_la )\n\terr_la = new Array();\n\t\n\tsstack.push( 0 );\n\tvstack.push( 0 );\n\t\n\tla = __##PREFIX##lex( info );\n\n\twhile( true )\n\t{\n\t\tact = ##ERROR##;\n\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t{\n\t\t\tif( act_tab[sstack[sstack.length-1]][i] == la )\n\t\t\t{\n\t\t\t\tact = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tif( ##PREFIX##_dbg_withtrace && sstack.length > 0 )\n\t\t{\n\t\t\t__##PREFIX##dbg_print( \"\\nState \" + sstack[sstack.length-1] + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tLookahead: \" + labels[la] + \" (\\\"\" + info.att + \"\\\")\\n\" +\n\t\t\t\t\t\t\t\"\\tAction: \" + act + \"\\n\" + \n\t\t\t\t\t\t\t\"\\tSource: \\\"\" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?\n\t\t\t\t\t\t\t\t\t\"...\" : \"\" ) + \"\\\"\\n\" +\n\t\t\t\t\t\t\t\"\\tStack: \" + sstack.join() + \"\\n\" +\n\t\t\t\t\t\t\t\"\\tValue stack: \" + vstack.join() + \"\\n\" );\n\t\t}\n\t\t\n\t\t\t\n\t\t//Panic-mode: Try recovery when parse-error occurs!\n\t\tif( act == ##ERROR## )\n\t\t{\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"Error detected: There is no reduce or shift on the symbol \" + labels[la] );\n\t\t\t\n\t\t\terr_cnt++;\n\t\t\terr_off.push( info.offset - info.att.length );\t\t\t\n\t\t\terr_la.push( new Array() );\n\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t\terr_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );\n\t\t\t\n\t\t\t//Remember the original stack!\n\t\t\tvar rsstack = new Array();\n\t\t\tvar rvstack = new Array();\n\t\t\tfor( var i = 0; i < sstack.length; i++ )\n\t\t\t{\n\t\t\t\trsstack[i] = sstack[i];\n\t\t\t\trvstack[i] = vstack[i];\n\t\t\t}\n\t\t\t\n\t\t\twhile( act == ##ERROR## && la != ##EOF## )\n\t\t\t{\n\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t__##PREFIX##dbg_print( \"\\tError recovery\\n\" +\n\t\t\t\t\t\t\t\t\t\"Current lookahead: \" + labels[la] + \" (\" + info.att + \")\\n\" +\n\t\t\t\t\t\t\t\t\t\"Action: \" + act + \"\\n\\n\" );\n\t\t\t\tif( la == -1 )\n\t\t\t\t\tinfo.offset++;\n\t\t\t\t\t\n\t\t\t\twhile( act == ##ERROR## && sstack.length > 0 )\n\t\t\t\t{\n\t\t\t\t\tsstack.pop();\n\t\t\t\t\tvstack.pop();\n\t\t\t\t\t\n\t\t\t\t\tif( sstack.length == 0 )\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\n\t\t\t\t\tact = ##ERROR##;\n\t\t\t\t\tfor( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t\t\t{\n\t\t\t\t\t\tif( act_tab[sstack[sstack.length-1]][i] == la )\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tact = act_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tif( act != ##ERROR## )\n\t\t\t\t\tbreak;\n\t\t\t\t\n\t\t\t\tfor( var i = 0; i < rsstack.length; i++ )\n\t\t\t\t{\n\t\t\t\t\tsstack.push( rsstack[i] );\n\t\t\t\t\tvstack.push( rvstack[i] );\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tla = __##PREFIX##lex( info );\n\t\t\t}\n\t\t\t\n\t\t\tif( act == ##ERROR## )\n\t\t\t{\n\t\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t\t__##PREFIX##dbg_print( \"\\tError recovery failed, terminating parse process...\" );\n\t\t\t\tbreak;\n\t\t\t}\n\n\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tError recovery succeeded, continuing\" );\n\t\t}\n\t\t\n\t\t/*\n\t\tif( act == ##ERROR## )\n\t\t\tbreak;\n\t\t*/\n\t\t\n\t\t\n\t\t//Shift\n\t\tif( act > 0 )\n\t\t{\n\t\t\t//Parse tree\n\t\t\tvar node = new treenode();\n\t\t\tnode.sym = labels[ la ];\n\t\t\tnode.att = info.att;\n\t\t\tnode.child = new Array();\n\t\t\ttree.push( treenodes.length );\n\t\t\ttreenodes.push( node );\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"Shifting symbol: \" + labels[la] + \" (\" + info.att + \")\" );\n\t\t\n\t\t\tsstack.push( act );\n\t\t\tvstack.push( info.att );\n\t\t\t\n\t\t\tla = __##PREFIX##lex( info );\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tNew lookahead symbol: \" + labels[la] + \" (\" + info.att + \")\" );\n\t\t}\n\t\t//Reduce\n\t\telse\n\t\t{\t\t\n\t\t\tact *= -1;\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"Reducing by producution: \" + act );\n\t\t\t\n\t\t\trval = void(0);\n\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPerforming semantic action...\" );\n\t\t\t\n##ACTIONS##\n\n\t\t\ttmptree = new Array();\n\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPopping \" + pop_tab[act][1] + \" off the stack...\" );\n\t\t\t\t\n\t\t\tfor( var i = 0; i < pop_tab[act][1]; i++ )\n\t\t\t{\t\t\t\n\t\t\t\ttmptree.push( tree.pop() );\n\n\t\t\t\tsstack.pop();\n\t\t\t\tvstack.pop();\n\t\t\t}\n\t\t\t\t\t\t\t\t\t\n\t\t\tgo = -1;\n\t\t\tfor( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )\n\t\t\t{\n\t\t\t\tif( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )\n\t\t\t\t{\n\t\t\t\t\tgo = goto_tab[sstack[sstack.length-1]][i+1];\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t\t\n\t\t\t//Parse tree\n\t\t\tvar node = new treenode();\n\t\t\tnode.sym = labels[ pop_tab[act][0] ];\n\t\t\tnode.att = rval;\n\t\t\tnode.child = tmptree.reverse();\n\t\t\ttree.push( treenodes.length );\n\t\t\ttreenodes.push( node );\n\t\t\t\n\t\t\tif( act == 0 )\n\t\t\t\tbreak;\n\t\t\t\t\n\t\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t\t\t__##PREFIX##dbg_print( \"\\tPushing non-terminal \" + labels[ pop_tab[act][0] ] );\n\t\t\t\t\n\t\t\tsstack.push( go );\n\t\t\tvstack.push( rval );\t\t\t\n\t\t}\n\t\t\n\t\tif( ##PREFIX##_dbg_withtrace )\n\t\t{\t\t\n\t\t\talert( ##PREFIX##_dbg_string );\n\t\t\t##PREFIX##_dbg_string = new String();\n\t\t}\n\t}\n\n\tif( ##PREFIX##_dbg_withtrace )\n\t{\n\t\t__##PREFIX##dbg_print( \"\\nParse complete.\" );\n\t\talert( ##PREFIX##_dbg_string );\n\t}\n\t\n\tif( err_cnt == 0 )\n\t{\n\t\t/*\n\t\tdocument.getElementById( \"parsetree\" ).innerHTML = __##PREFIX##dbg_parsetree_phpSyntaxTree( treenodes, tree );\n\t\t*/\n\t\tdocument.getElementById( \"parsetree\" ).innerHTML =__##PREFIX##dbg_parsetree( 0, 0,\n\t\t\t__##PREFIX##dbg_get_tree_depth( treenodes, tree, 0 ), treenodes, tree );\n\t}\n\t\n\treturn err_cnt;\n}\n\nfunction __##PREFIX##dbg_image( name )\n{\n\treturn \"<img src=\\\"img/\" + name + \".png\\\" style=\\\"border: 0px; margin: 0px; padding: 0px;\\\" />\";\n}\n\nfunction __##PREFIX##dbg_get_tree_depth( nodes, tree, max )\n{\n\tvar\t\ttmp\t\t= 0;\n\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tif( max < ( tmp = __dbg_get_tree_depth( nodes, nodes[ tree[i] ].child, max+1 ) ) )\n\t\t\t\tmax = tmp;\n\t}\n\t\n\treturn max;\n}\n\nfunction __##PREFIX##dbg_parsetree( prev, cnt, depth, nodes, tree )\n{\n\tvar str = new String();\n\t\n\tif( cnt == 0 )\n\t\tstr += \"<table border=\\\"0\\\" cellpadding=\\\"0\\\" cellspacing=\\\"0\\\" class=\\\"parsetree\\\">\";\n\t\n\tif( !prev )\n\t\tprev = new Array();\n\t\t\n\tif( cnt > 0 )\n\t\tprev[cnt-1] = true;\n\t\t\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tstr += \"<tr>\";\n\n\t\tfor( var j = 0; j < cnt; j++ )\n\t\t{\n\t\t\tstr += \"<td>\";\n\n\t\t\tif( prev[j] )\n\t\t\t{\n\t\t\t\tif( j == cnt - 1 && i == tree.length - 1 )\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"ll\" );\n\t\t\t\telse if( j == cnt - 1 )\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"la\" );\n\t\t\t\telse\n\t\t\t\t\tstr += __##PREFIX##dbg_image( \"l\" );\n\t\t\t}\n\t\t\telse\n\t\t\t\tstr += __##PREFIX##dbg_image( \"e\" );\n\t\t\t\t\n\t\t\tstr += \"</td>\";\n\t\t}\n\t\t\n\t\tif( cnt > 0 && i == tree.length - 1 )\n\t\t\tprev[cnt-1] = false;\n\n\t\tstr += \"<td>\";\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tif( cnt == 0 )\n\t\t\t\tstr += __##PREFIX##dbg_image( \"rn\" );\n\t\t\telse\n\t\t\t\tstr += __##PREFIX##dbg_image( \"n\" );\t\n\t\telse\n\t\t\tstr += __##PREFIX##dbg_image( \"t\" );\n\t\tstr += \"</td>\";\n\t\t\n\t\tstr += \"<td class=\\\"node_name\\\" colspan=\\\"\" + ( depth - cnt + 1 ) + \"\\\">\" + nodes[ tree[i] ].sym ;\n\t\tif( nodes[ tree[i] ].att && nodes[ tree[i] ].att != \"\" )\n\t\t\tstr += \":<span>\" + nodes[ tree[i] ].att + \"</span>\" ;\n\t\t\t\n\t\tstr += \"</td>\";\n\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tstr += __##PREFIX##dbg_parsetree( prev, cnt+1, depth, nodes, nodes[ tree[i] ].child );\n\t}\n\t\n\tif( cnt == 0 )\n\t\tstr += \"</table>\";\n\t\n\treturn str;\n}\n\nfunction __##PREFIX##dbg_parsetree_phpSyntaxTree( nodes, tree )\n{\n\tvar str = new String();\n\t\n\tfor( var i = 0; i < tree.length; i++ )\n\t{\n\t\tstr += \" [ \";\n\n\t\tstr += nodes[ tree[i] ].sym;\n\t\tif( nodes[ tree[i] ].att && nodes[ tree[i] ].att != \"\" )\n\t\t{\n\t\t\tvar attr = new String( nodes[ tree[i] ].att );\n\t\t\tstr += \":\\\"\" + attr.replace( / |\\t|\\r|\\n|\\[|\\]/g, \"_\" ) + \"\\\"\";\n\t\t}\n\t\t\t\n\t\tstr += \" \";\n\n\t\tif( nodes[ tree[i] ].child.length > 0 )\n\t\t\tstr += __##PREFIX##dbg_parsetree_phpSyntaxTree( nodes, nodes[ tree[i] ].child );\n\n\t\tstr += \" ] \";\n\t}\n\t\n\treturn str;\n}\n\n\n##FOOTER##";

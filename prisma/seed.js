"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma1 = new client_1.PrismaClient();

async function seed() {
  const email = "felipealisboa@outlook.com";
  const username = "felipealisboa";

  await prisma1.user.delete({ where: { email } }).catch(e => 'registers not found it.');

  const hashedPassword = await bcrypt.hash("97150280", 10);

  console.time('🔑 Created permissions...')
	const entities = ['user', 'note']
	const actions = ['create', 'read', 'update', 'delete']
	const accesses = ['own', 'any']
	for (const entity of entities) {
		for (const action of actions) {
			for (const access of accesses) {
				await prisma1.permission.create({ data: { entity, action, access } })
			}
		}
	}

  console.timeEnd('🔑 Created permissions...')

	console.time('👑 Created roles...')
	await prisma1.role.create({
		data: {
			name: 'admin',
			permissions: {
				connect: await prisma1.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
	})
	await prisma1.role.create({
		data: {
			name: 'user',
			permissions: {
				connect: await prisma1.permission.findMany({
					select: { id: true },
		  			where: { access: 'own' },
				}),
			},
		},
	})
	console.timeEnd('👑 Created roles...')

  const user = await prisma1.user.create({
    data: {
      email,
      username,
      roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma1.user.create({
    data: {
      email: 'contato.rafaelvinicius@gmail.com',
      username: 'rafael',
      roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  /* Upload country / Banks / Payment methods */
  /* Brazil */
  await prisma1.country.create({
    data: {
      userId: user.id,
      country: "Brazil",
      flag: "https://flagicons.lipis.dev/flags/4x3/br.svg",
      banks: {
        create: [
        {
          name: "Santander",
          logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },            
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        },
        {
          name: "Caixa Econômica",
          logo: "https://thumbs2.imgbox.com/29/f4/LXXzquqv_t.png",
          payment: {
            create: [
              {
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount. To register the beneficiary for high amount and also transfer follow these steps.",
              steps: {
                create: [
                  {
                  st1_pic: "https://thumbs2.imgbox.com/0d/a3/ZvzMiIrp_t.png",
                  st1_text: "The client can access the CEF online banking, click on the option to CEF Online Banking.",
                  st2_pic: "https://thumbs2.imgbox.com/14/2d/FN7ajY3E_t.png",
                  st2_text: "The client have in the app the symbol of pix and must click to open the options to pay with Pix and to register the beneficiary for high amount.",
                  st3_pic: "https://thumbs2.imgbox.com/86/ff/hy2zb7xP_t.png",
                  st3_text: "To access the beneficiary, the client need first do a payment with the PIX code. So after the client selected the Payment option need to add the PIX code or scan the QR code. Will be 2 simple steps, confirm the key, input the amount and click on continue.",
                  st4_pic: "https://thumbs2.imgbox.com/e6/44/maRLRmc6_t.png",
                  st4_text: "After step to complete the transaction is to insert the pin with 6 numbers. Consider that for high amount and for new beneficiary the client will need to scan his face and maybe other confirmations.",
                  st5_pic: "https://thumbs2.imgbox.com/f4/20/5vOslQ63_t.png",
                  st5_text: "The client will receive a confirmation of the transaction, the credit take few seconds, if you not receive the client must try again.", 
                  st6_pic: "https://thumbs2.imgbox.com/10/b1/b72XNf9P_t.png",
                  st6_text: "After the client receive the ok, need to scroll down and select the Favorite option.",
                }
              ]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/29/f4/LXXzquqv_t.png",
              limits: "Card block for any kind of international transactions.",
              information: "CEF debit card is blocked for any kind of international transactions.",
              steps: {
                create: [{
                  st1_pic: "",
                  st1_text: "",
                  st2_pic: "",
                  st2_text: ""
                }]
              }
          },
          {
            type: "credit",
            symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
            limits: "Variable by clients history, been the minimum R$ 1.000,00. The client can consult the credit card limit on your invoice, on the CAIXA Cards Application or on the CAIXA Internet Banking.",
            information: "CEF credit cards can be used for international transactions. To do so, you will need to activate the international transaction feature for your card. You can do this by contacting CEF customer service or by logging into your CEF online banking account and following the instructions.",
            steps: {
              create: [{
                st1_pic: "https://thumbs2.imgbox.com/0d/a3/ZvzMiIrp_t.png",
                st1_text: "The client can access the CEF online banking, click on the option to CEF Online Banking.",
                st2_pic: "https://thumbs2.imgbox.com/85/a9/Hd6CH88N_t.png",
                st2_text: "Go to option (right corner), after click will open the menu with option and the client must scroll down and select Credit Card (Cartão de Crédito).",
                st3_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                st3_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card.",
                st4_pic: "https://thumbs2.imgbox.com/29/c3/ERLFhPYs_t.png",
                st4_text: "Choose the option to allow online shopping and confirm."
              }]
            },
          }]
        },
        }, 
        {
          name: "Banco do Brasil",
          logo: "https://logopng.com.br/logos/banco-do-brasil-5.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        }, {
          name: "Itau",
          logo: "https://mir-s3-cdn-cf.behance.net/project_modules/hd/97f45217072303.562b554a0d901.jpg",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        }, {
          name: "Bradesco",
          logo: "https://www.logotypes101.com/logos/40/CA8543BA7AB6ECA1FC0F97A942A51A50/Bradesco.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        } ]
      }
    },
  });

    /* Chile */
  await prisma1.country.create({
    data: {
      userId: user.id,
      country: "Chile",
      flag: "https://flagicons.lipis.dev/flags/4x3/cl.svg",
      banks: {
        create: [{
          name: "Santander",
          logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        }]
      }
    },
  });
  
    /* Mexico */
  await prisma1.country.create({
    data: {
      userId: user.id,
      country: "Mexico",
      flag: "https://flagicons.lipis.dev/flags/4x3/mx.svg",
      banks: {
        create: [{
          name: "Santander",
          logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        }]
      }
    },
  });
  
    /* Peru */
  await prisma1.country.create({
    data: {
      userId: user.id,
      country: "Peru",
      flag: "https://flagicons.lipis.dev/flags/4x3/pe.svg",
      banks: {
        create: [{
          name: "Santander",
          logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
          payment: {
            create: [{
              type: "transfer",
              symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                  st1_text: "Open BR Santander App and choose Transfer option",
                  st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                  st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                }]
              },
            },
            {
              type: "debit",
              symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              }
            },
            {
              type: "credit",
              symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
              limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
              information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
              steps: {
                create: [{
                  st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                  st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                  st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                  st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                }]
              },
            }]
          }
        }]
      }
    },
  });

    /* Argentina */
    await prisma1.country.create({
      data: {
        userId: user.id,
        country: "Argentina",
        flag: "https://flagicons.lipis.dev/flags/4x3/ar.svg",
        banks: {
          create: [{
            name: "Santander",
            logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }, {
            name: "Banco do Brasil",
            logo: "https://logopng.com.br/logos/banco-do-brasil-5.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }, {
            name: "Itau",
            logo: "https://mir-s3-cdn-cf.behance.net/project_modules/hd/97f45217072303.562b554a0d901.jpg",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }, {
            name: "Bradesco",
            logo: "https://www.logotypes101.com/logos/40/CA8543BA7AB6ECA1FC0F97A942A51A50/Bradesco.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          } ]
        }
      },
    });
  
      /* Bolivia */
    await prisma1.country.create({
      data: {
        userId: user.id,
        country: "Bolivia",
        flag: "https://flagicons.lipis.dev/flags/4x3/bo.svg",
        banks: {
          create: [{
            name: "Santander",
            logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }]
        }
      },
    });
    
      /* Colombia */
    await prisma1.country.create({
      data: {
        userId: user.id,
        country: "Colombia",
        flag: "https://flagicons.lipis.dev/flags/4x3/co.svg",
        banks: {
          create: [{
            name: "Santander",
            logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }]
        }
      },
    });
    
      /* Guatemala */
    await prisma1.country.create({
      data: {
        userId: user.id,
        country: "Guatemala",
        flag: "https://flagicons.lipis.dev/flags/4x3/sv.svg",
        banks: {
          create: [{
            name: "Santander",
            logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
            payment: {
              create: [{
                type: "transfer",
                symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                    st1_text: "Open BR Santander App and choose Transfer option",
                    st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                    st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                  }]
                },
              },
              {
                type: "debit",
                symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                }
              },
              {
                type: "credit",
                symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                steps: {
                  create: [{
                    st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                    st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                    st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                    st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                  }]
                },
              }]
            }
          }]
        }
      },
    });
  
      /* El Salvador */
      await prisma1.country.create({
        data: {
          userId: user.id,
          country: "El Salvador",
          flag: "https://flagicons.lipis.dev/flags/4x3/sv.svg",
          banks: {
            create: [{
              name: "Santander",
              logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
              payment: {
                create: [{
                  type: "transfer",
                  symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                      st1_text: "Open BR Santander App and choose Transfer option",
                      st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                      st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                    }]
                  },
                },
                {
                  type: "debit",
                  symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  }
                },
                {
                  type: "credit",
                  symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  },
                }]
              }
            }]
          }
        },
      });

      /* Ecuador */
      await prisma1.country.create({
        data: {
          userId: user.id,
          country: "Ecuador",
          flag: "https://flagicons.lipis.dev/flags/4x3/ec.svg",
          banks: {
            create: [{
              name: "Santander",
              logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
              payment: {
                create: [{
                  type: "transfer",
                  symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                      st1_text: "Open BR Santander App and choose Transfer option",
                      st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                      st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                    }]
                  },
                },
                {
                  type: "debit",
                  symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  }
                },
                {
                  type: "credit",
                  symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  },
                }]
              }
            }]
          }
        },
      });

       /* Honduras */
       await prisma1.country.create({
        data: {
          userId: user.id,
          country: "Honduras",
          flag: "https://flagicons.lipis.dev/flags/4x3/hn.svg",
          banks: {
            create: [{
              name: "Santander",
              logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
              payment: {
                create: [{
                  type: "transfer",
                  symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                      st1_text: "Open BR Santander App and choose Transfer option",
                      st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                      st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                    }]
                  },
                },
                {
                  type: "debit",
                  symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  }
                },
                {
                  type: "credit",
                  symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  },
                }]
              }
            }]
          }
        },
      });

       /* Costa Rica */
       await prisma1.country.create({
        data: {
          userId: user.id,
          country: "Costa Rica",
          flag: "https://flagicons.lipis.dev/flags/4x3/cr.svg",
          banks: {
            create: [{
              name: "Santander",
              logo: "https://thumbs2.imgbox.com/ef/aa/Kv6AZKQK_t.png",
              payment: {
                create: [{
                  type: "transfer",
                  symbol: "https://logospng.org/download/pix/logo-pix-1024.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://cms.santander.com.br/sites/WPS/imagem/imagem-app-nova-conheca-vitrine-1/19-09-13_193835_P_banner_800x530_home.png",
                      st1_text: "Open BR Santander App and choose Transfer option",
                      st2_pic: "https://s2-techtudo.glbimg.com/T2hWbkeywWNH0ZsOHPw0cJoTgAw=/0x0:695x595/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2020/N/k/A44Vv8RleE2CkxbIYIkQ/techtudo1.jpg",
                      st2_text: "Select Pix option and click on the Código QR to scan the code (if you have the client on the phone, remember that the client need to handle the camera to scan the code from your plataform), finish to fulfill the transfer anc click on continue util the code input to confirm the transfer."
                    }]
                  },
                },
                {
                  type: "debit",
                  symbol: "https://thumbs2.imgbox.com/b0/24/MfVjoT8P_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  }
                },
                {
                  type: "credit",
                  symbol: "https://thumbs2.imgbox.com/03/e9/uS3P9rSP_t.png",
                  limits: "BRL 10,000/day (individuals) and BRL 50,000/day (legal entities);",
                  information: "Work with high amount if the client register the beneficiary. Have a block after 8:00h PM (Brazilian timezone) for high amount.",
                  steps: {
                    create: [{
                      st1_pic: "https://thumbs2.imgbox.com/21/c8/cWfZvRdt_t.png",
                      st1_text: "How to allow internet shopping with Debit card? After the user login on his Santander App the user must click on Option (Opção).",
                      st2_pic: "https://thumbs2.imgbox.com/f7/90/NMw8I5N1_t.png",
                      st2_text: "In the bottom of the screen, click on the option to Allow Compra na Internet, verify the best PSP for this card."
                    }]
                  },
                }]
              }
            }]
          }
        },
      });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma1.$disconnect();
  });

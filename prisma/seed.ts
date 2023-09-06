import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({ datasources: {  db: { url: "postgres://postgres:PJi&4_dRcS2KwbQ@db.ffdinraeoulwnidqsphj.supabase.co:5432/postgres" } } });

async function seed() {
  const email = "felipealisboa@outlook.com";
  const username = "felipealisboa";

  await prisma.user.delete({ where: { email } }).catch(e => 'registers not found it.');

  const hashedPassword = await bcrypt.hash("97150280", 10);

  console.time('🔑 Created permissions...')
	const entities = ['user', 'note']
	const actions = ['create', 'read', 'update', 'delete']
	const accesses = ['own', 'any'] as const
	for (const entity of entities) {
		for (const action of actions) {
			for (const access of accesses) {
				await prisma.permission.create({ data: { entity, action, access } })
			}
		}
	}

  console.timeEnd('🔑 Created permissions...')

	console.time('👑 Created roles...')
	await prisma.role.create({
		data: {
			name: 'admin',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
	})
	await prisma.role.create({
		data: {
			name: 'user',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
		  			where: { access: 'own' },
				}),
			},
		},
	})
	console.timeEnd('👑 Created roles...')

  const user = await prisma.user.create({
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

  /* Upload country / Banks / Payment methods */
  /* Brazil */
  await prisma.country.create({
    data: {
      userId: user.id,
      country: "Brazil",
      flag: "https://flagicons.lipis.dev/flags/4x3/br.svg",
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

    /* Chile */
  await prisma.country.create({
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
  await prisma.country.create({
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
  await prisma.country.create({
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
    await prisma.country.create({
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
    await prisma.country.create({
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
    await prisma.country.create({
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
    await prisma.country.create({
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
      await prisma.country.create({
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
      await prisma.country.create({
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
       await prisma.country.create({
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
       await prisma.country.create({
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
    await prisma.$disconnect();
  });

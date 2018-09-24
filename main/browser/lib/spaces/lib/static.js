
'use strict';

module.exports = {
	Data:  [
		function (path) { 
			var res = { copy: [], other: [] },
				br  = { tag: 'br' },
				pnl = { from: 'Evectr', name: ['Content','Panel'] },
				blk = { from: 'Evectr', name: ['Content','Block'] },
				act = { from: 'Evectr', name: ['Content','Activity'] },
				phn = { from: 'Stock',  name: ['PhoneNum'] },
				eml = { from: 'Stock',  name: ['NormalLink'] },
				cnt = {
					Address: {
						Name: 	 'eVectr Services Inc.',
						Street:	 '123 - 456 Fake Ave',
						City:	 'Calgary',
						Region:	 'Alberta',
						Postal:	 'F4K 3P0',
						Country: 'Canada',
					},
					Phone: { '#': '1 (888) 234-5678' },
				};
			switch (path) {
				case 	  '/about':	res.copy = [
										{
											tag: pnl, props: { 
												name:	'about',
												header: { fixed: true, label: 'What is eVectr?' },
												body:	[
													{
														tag:	'p', props:	{ className: 'text' },
														items: 	['The concept for eVectr was to create a free-to-use multi-purpose online platform that combines social networking with searchable input defined capabilities and an ever-growing segment of the population that possess differing skills, talents, education, or specialized training that have a desire to offer such attributes as third-party based services with the primary goal of generating commerce.'],
													}, {
														tag:	'p', props:	{ className: 'text' },
														items: 	['Simply put, the platform is an online environment where individuals can search for another user with the characteristic they have inputted for purposes of either social interaction or e-commerce. A vector can be defined as point in which several lines converge. As the name suggests, eVectr purposefully converges a collection many current online functionalities dispersed over existing e-applications and websites into a single simplified platform. Some of these functionalities include, social networking, niche interest development, travel tool, online dating, education and skill progression, online market expansion and entrepreneurship.'],
													}, {
														tag:	'p', props:	{ className: 'text' },
														items: 	['We trust that our platform will enable users from around the world to find and interact with anyone else per their own specification through our input defined search capabilities. Thus, opening them up to an environment filled with distinct interests, skills and resources that they could then use to enrich their lives or simply make it easier. Along the way, we hope to provide any users seeking to earn extra income or be a venue to earn their primary income; a place to do so that is relative quick, cost-effective, possess a define market base and  is secure.'],
													}
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'contact-us',
												kind:	'full',
												align: 	'gridPair',
												header: { fixed: true, label: 'Contact Us', subs: [
													{ name: 'by-email', label: 'By Email', },
													{ name: 'by-mail',  label: 'By Mail',  },
													{ name: 'by-phone', label: 'By Phone', },
												]	},
												body:	[
													{
														tag:	'p', props:	{ className: 'text spread' },
														items: 	['If you have any questions, suggestions, concerns, or issues with our application, we can be reached by the following methods:'],
													}, {
														tag:	blk, props:  { 
															name: 	'by-email', 
															header: { fixed: true, label: 'By Email' },
															items: 	[
																{
																	tag: act, props:	{ 
																		title: 'Support',
																		details: { tag: eml, props: { kind: 'email', value: 'support@evectr.com' } },
																	},
																}, {
																	tag: act, props:	{ 
																		title: 'Privacy Officer',
																		details: { tag: eml, props: { kind: 'email', value: 'privacy@evectr.com' } },
																	},
																}, {
																	tag: act, props:	{ 
																		title: 'Media Inquiries',
																		details: { tag: eml, props: { kind: 'email', value: 'media@evectr.com' } },
																	},
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'by-mail', 
															header: { fixed: true, label: 'By Mail' },
															items: 	[{
																tag: 	{ from: 'Stock', name: ['Address'] },
																props: 	cnt.Address
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'by-phone', 
															header: { fixed: true, label: 'By Phone' },
															items: 	[
																{
																	tag: act, props:	{ 
																		title: 'Support',
																		details: { tag: phn, props: { number: cnt.Phone } },
																	},
																}, 
															],
														}
													}, 
												],		
											}
										}, 
									]; break;;
				case 	   '/help': res.sidebar = [
										{ small: true, href: '#question-1', 	label: 'How to Optimize your Profile Searches to get the Best Results?' },
										{ small: true, href: '#question-2', 	label: 'How to input your Hobbies and Interests?' },
										{ small: true, href: '#question-3', 	label: 'How to Input the Languages you speak? ' },
										{ small: true, href: '#question-4', 	label: 'How/why should you add your Nationality (and Ethnicity/Race)?' },
										{ small: true, href: '#question-5', 	label: 'Should you input Religion into your Profile?' },
										{ small: true, href: '#question-6', 	label: 'How do I block another user? ' },
										{ small: true, href: '#question-7', 	label: 'What is the Significance of the eVectr User Surveys? ' },
										{ small: true, href: '#question-8', 	label: 'What are Users/Service Provider Security Badges?' },
										{ small: true, href: '#question-9', 	label: 'Why should I Redact and Remove Sensitive Information? ' },
										{ small: true, href: '#question-10', 	label: 'How are Service Provider Ratings and Sale Benchmarks Significant?' },
										{ small: true, href: '#question-11', 	label: 'How to Request a Profile Audit or Reporting a Violation?' },
										{ small: true, href: '#question-12', 	label: 'What is relationship between eVectr and Service Provider? ' },
										{ small: true, href: '#question-13', 	label: 'How do I carry-out Transactions?' },
										{ small: true, href: '#question-14', 	label: 'Why and how are the Ads on your Profile Targeted to you?' },
										{ small: true, href: '#question-15', 	label: 'Why Are there no inputs for political affiliation or persuasion?' },
									];
									res.copy = [
										{
											tag: pnl, props: { 
												name:	'question-1', 
												header: { fixed: true, small: true, label: 'How to Optimize your Profile Searches to get the Best Results?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['eVectr provides two methods to search for profiles on the platform; the General Profile Search bar and Advanced Search options. The General Profile Search functions similarly to a standard browser search in which a user can input what they are looking for while search algorithm selects the necessary keywords to help populate the results.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																{ tag: 'b', items: ['Example 1:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['Female French Translator in New York'] }] },
																{ tag: 'b', items: ['Example 2:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['Indian Cook that speaks Hindi in London'] }] },
															]	}, 
														]
													}, 
													{ tag: 'p', props: { className: 'text' }, items: ['This search method is meant for the casual user; intent on populating quick results based on just a selected few inputs. On the other hand, the Advanced Search is more meticulous offering the users specific search categories field to input prior to making a search.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																{ tag: 'b', items: ['Example 1:'] }, {
																	tag: 'div', props: { className: 'code' }, items: [
																		{ tag: 'code', items: ['Service Type: Translator'] },
																		{ tag: 'code', items: ['Rate: $20 per: Hour'] },
																		{ tag: 'code', items: ['Location: New York. New York'] },
																		{ tag: 'code', items: ['Languages: French'] },
																		{ tag: 'code', items: ['Nationality: French, American (',{ tag: 'i', items: [{ tag: 'a', props: { href: '#question-4' }, items: ['See Below'] }] },')'] },
																		{ tag: 'code', items: ['Marital Status: Married'] },
																		{ tag: 'code', items: ['Sex: Female'] },
																]	}
															]	}, 
														]
													}, 
													{ tag: 'p', props: { className: 'text' }, items: ['The Advanced Search method is meant for both new users unfamiliar with the type of search fields available; plus the addition of auto suggest feature allows the users to type the first few letters of what they are searching for to populate a number of search options starting with the same letters. The advanced search is also for users seeking to narrow down their search results per their specification.'] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-2', 
												header: { fixed: true, small: true, label: 'How to input your Hobbies and Interests?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['Specify the hobbies or interests that are most relevant to you within the directed field. The hobbies and interests you specify do not have to be in any particular order, but do require you to input them one at a time. If you are unsure if the hobby or interest you inputted exist within our database, please try to type in a keyword (basketball) and the search field should populate with a list of options (playing basketball or watching basketball) to select from. Once a hobby or interest is added correctly, a grey surrounding box will appear around the input as well a small identifiable x in front of it. If you want to delete the specific input, it’s simply a matter of clicking on the x. Furthermore, we do encourage the user to keep hobbies and input to fairly manageable (around 5), but the choice is up to the user to add more or less.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																{ tag: 'b', items: ['Example 1:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['Watching Movies, Basketball (Playing), Cooking'] }] },
																{ tag: 'b', items: ['Example 2:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['Hiking, Skiing, Traveling, Painting'] }] },
															]	}, 
														]
													}, 
													{ tag: 'div', props: { className: 'help info' }, items: [ 
														{ tag: 'b', items: ['NOTE:'] }, 
														' eVectr is attempting to accommodate as many hobbies and interest as it can, but currently our list is general in nature. If you would like us to add hobbies and interest not mentioned in this list. Please send a message via our Contact Us page and specify the hobby or interest to add. We will make an effort to accommodate on next available update.',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-3', 
												header: { fixed: true, small: true, label: 'How to Input the Languages you speak? ' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['State the languages you speak in the field directed. There is no particular order in which you identify the languages you speak. However, we do request that you input each language one at a time. If you wish to verify that the language of choice is within our database, please input a few of letters that language starts with and our search field should populate a list of languages starting with the same letters. Once each of the language is added a grey box will appear around the input and a small x in front of it. If you incorrectly added a language simply press the x to delete the input. '] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																{ tag: 'b', items: ['Example 1:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['English, French, Spanish, German'] }] },
															]	}, 
														]
													}, 
													{ tag: 'div', props: { className: 'help info' }, items: [ 
														{ tag: 'b', items: ['NOTE:'] }, 
														' If eVectr has somehow omitted a language that you speak please send us message on our Contact Us page and specify said language. We will make an effort to add this language on our next available update.',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-4', 
												header: { fixed: true, small: true, label: 'How/why should you add your Nationality (and Ethnicity/Race)?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['We at eVectr understand that nationality, ethnicity and race are not the same thing; however, to streamline the search capabilities we have combine these inputs in some sense. Typically, inputting one’s nationality should be a simple process and indeed it is; if you fall under the category where you can describe your nationality in one word (i.e. American, Canadian, French, Australian); which under the eVectr system is you prerogative to do so. However, someone’s nationality takes on slightly different context when you add ethnicity or race into the mix. Both Chinese American and African American are no less American, but there is validity in the preceding and proceeding heritage descriptor; especially, as a search variable. For example, a Chinese American user may want the opinion of another Chinese American with regard to which restaurant has their best ethnic food. Nevertheless, eVectr has not made the way in which a user input’s his or her nationality a prerequisite nor the particular input as such. '] },
													{ tag: 'p', props: { className: 'text' }, items: ['As mentioned earlier adding your nationality as an input is your choice and taking that extra step forward to be even more specific with the addition of race or ethnicity nationality descriptors will require the order of the wording to be compulsory in order to maximize the effectiveness of the search algorithm. Continuing with Chinese American as an example onto how to correctly add this nationality (ethnicity/race), which simply put must be: American, Chinese. The basic reasoning is that, if you disregard all the other inputs as contributing factors, then by default the search algorithms in sequence will first search American, which populates the results with only Americans and then narrow the search field even further when Chinese is introduced. This in essence is how the eVectr search functionality works to find user who inputted their nationality as Chinese American. '] },
													{ tag: 'p', props: { className: 'text' }, items: ['It is important to remember that when a user adds their information in nationality field; said field is restricted to only two inputs (i.e. American, Scottish or American, African) anything further defeats the purpose. Similar other input field’s nationality will auto-populate with suggestions once a user types in a few letters; however, this suggestion only accounts for one world at a time (searching "Amari" will populate America and not Irish American). As such, it’s up to user to add each word of their nationality one at time. A grey box will appear after selection of each input with x in front, which allows the user to delete their input or selection as needed.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																{ tag: 'b', items: ['Example 1:'] },
																{ tag: 'div', props: { className: 'code' }, items: [{ tag: 'code', items: ['American, Australian, English, Lithuania'] }] },
																{ tag: 'b', items: ['Example 2:'] },
																{ tag: 'div', props: { className: 'code' }, items: [
																	{ tag: 'code', items: ['American,'] },
																	{ tag: 'code', items: ['Irish for Irish American or Canadian,'] },
																	{ tag: 'code', items: ['Norwegian for Norwegian Canadian or Australian,'] },
																	{ tag: 'code', items: ['Laotian for Laotian Australian or French,'] },
																	{ tag: 'code', items: ['Ethiopian for Ethiopian French'] },
																] 	},
															]	}, 
														]
													}, 
													{ tag: 'div', props: { className: 'help nope' }, items: [ 
														{ tag: 'b', items: ['IMPORTANT:'] }, 
														' Inputting your nationality is optional. Bear in mind, by adding this information it becomes searchable for the other users. Use you own discretion in locations where this information can be used against you (this point is reiterated in your User Terms and Condition under User Profile and Information Inputs).',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-5', 
												header: { fixed: true, small: true, label: 'Should you input Religion into your Profile?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['The addition of your religion should and must always remain your decision to make. The reality is however, there are particular regions of the world where such information can be use to discriminate, alienate and otherwise profile for social and political ends; thus, putting the user in potential harm. Use your own discretion with regards to inputting this information as it remains and will continue to remain optional. Furthermore, if you choose to add this information, you can also toggle the Visibility Buttons in Settings just so the information is not public viewable.'] },
													{ tag: 'div', props: { className: 'help nope' }, items: [ 
														{ tag: 'b', items: ['IMPORTANT:'] }, 
														' Inputting your Religion is optional. Bear in mind, by adding this information it becomes searchable for the other users. Use you own discretion in locations where this information can be used against you (this point is reiterated in your User Terms and Condition under User Profile and Information Inputs).',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-6', 
												header: { fixed: true, small: true, label: 'How do I block another user? ' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['As with many other social networking applications, the ability to block another user is a mandatory functionality that empowers the concept of choice; in this case, the choice to interact with whomever you want. Blocking another user can come in two forms. The first is during an initial interaction message where you will be prompt to accept the contact or block per your privy. The other occurring after you has accepted the user as a contact into your community list. Per your discretion, you can then select the user in the community and will be prompted the option to block the user. You can do so by clicking the accept button.'] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-7', 
												header: { fixed: true, small: true, label: 'What is the Significance of the eVectr User Surveys? ' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['The eVectr surveys is a two-directional system meant to ensure all parties continue to act in good faith; not only for service seekers and service provider within a single specific transaction, but for all users of this classification in the future. The term two-directional system refers the fact that both the service seeker and service provider’s rate and review their experience. As a result, the accumulation ratings of a service provider will help other users determine whether the service provider in question, is a viable choice when seeking his or her service in the future. Alternatively, the accumulation rating of a service user will determine if he or she is viable customer for other service providers. The eVectr surveys also serve as the place to make long-form complaints about a bad experience, which in turn will directly go to eVectr User Satisfaction Team for review. Depending on the nature of the offense committed by either the service user or service provider, punitive action may be applied to help ensure the same transgression are not repeated. '] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-8', 
												header: { fixed: true, small: true, label: 'What are Users/Service Provider Security Badges?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['The basis of the eVectr Security Badge system was created to ensure both protection and confidence for the users seeking the service as well as the service provider themselves. Naturally, the burden of responsibility tends to skew towards the Service Provider; resulting, in multifaceted system that requires the user to fulfill another separate criteria. Each of these criteria is represented by a color coated shield on the right side of a user’s profile. The following describes each of the criteria required for the user to fulfill and the subsequent color coded shield that represents them:'] },
													{
														tag:	blk, props:  { 
															name: 	'for-all-users', 
															header: { fixed: true, label: 'For All eVectr Users' },
															items: 	[{ tag: 'p', props: { className: 'text' }, items: ['Public Identity Verification Measure. Located on the user’s Settings page and requires the user to provider current identifiable photos of themselves as well as the option to add corroborating links from another social networking platform (Facebook, LinkedIn, Instagram, etc.) or upload certified photo ID with any sensitive information redacted or removed; leaving the only pertinent information, the user’s name. The purpose being, other users will be able to identify the person who created the profile via the options provided within this measure (i.e. comparing current photos to the uploaded photo ID and the name on said ID or links provided). The expectation is that everyone using the eVectr platform (standard user, service seeker and service providers) has uploaded the necessary requirements in this criterion. Doing so, will award the user with green shield badge on their profile. The green shield badge will be standard indicator to other users that you are someone making an effort to be trustworthy and similarly to be careful when interacting with users who have not made this effort. The green shield is the only requirement security badge for standard users and service seekers.'] }],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'for-providers', 
															header: { fixed: true, label: 'For Service Providers Only' },
															items: 	[
																{ tag: 'p', props: { className: 'text' }, items: ['Upload Relevant Credentials. A service provider will need to navigate to My Services page and upload the necessary credential documents to this section. These documents may include accreditation, licenses, background checks, bondability material, etc.). Fulfilling this criterion serves to show other users that you are qualified to perform service you are offering as well as provide any other documents that works to both reassure and build trust. Doing so, will award the service provider with blue shield badge, which again will be clearly presented on the individual’s profile.'] },
																{ tag: 'div', props: { className: 'help nope' }, items: [ 
																	{ tag: 'b', items: ['IMPORTANT:'] }, 
																	' Security badges can be suspended and revoked based upon validity of documents uploaded in either criterion. Please see the Users/Service Provider Conduct Standards and Violations section below.',
																]	},
																{ tag: 'p', props: { className: 'text' }, items: ['It is important to remember that although a service provider must try to fulfill all the criteria above to get all their security badges. Missing security badges for the last two criteria, does not indicate wrongdoing on part of the Service Provider. It is the responsibility service seeker to evaluate this score and perform their own due diligence to determine if the particular service provider is viable for them. For example, a family trained regional cook specializing in French dishes may not have the accompanying credentials to upload to prove their skill set; this doesn’t mean they don’t have the ability to perform the given task of the user. '] },
															]
														}
													}, 
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-9', 
												header: { fixed: true, small: true, label: 'Why should I Redact and Remove Sensitive Information? ' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['An important aspect of establishing trusts on the eVectr platform may require you to upload three current photos and a certified photo ID to corroborate your identity (i.e. citizenship cards, voter ID, driver’s license, passports, etc.); and in the case of service provider uploads certification documents (ie. accreditation, licenses, background checks, bondability material, certificate awards, etc.) that reasonably prove that you are qualified for the service they offer. As mentioned the purpose of this is to establish trust, but at the same time we don’t want user to disregard safeguarding any sensitive material, this is the reason why we request that you either redact or remove such details off the documents before you upload. In the case of a certified photo IDs, the only relevant information required to showcase would be the photo of you on the ID and your full name (possibly you could keep your date of birth if you already added as a detail in your profile). On the other hand, certification documents won’t even require the photo aspect. Simply, ensure your full name is valid on the document to serve as comparison. It is important remember that photo ID verification and certification documents are meant to be work in conjunction with one another. Additionally, information on the documents you upload should be legible, but we would recommend in the case of your ID only, to take a photo of the document for upload and to avoid perfect scans of such material. The reason being, it establishes the document as being physical and real, but again please make sure the photo and name on the document is clearly decipherable.'] },
													{ tag: 'p', props: { className: 'text' }, items: ['So, what exactly is considered sensitive information?  Generally, any information that another person can use to help steal your identity constitutes sensitive information. As such, all uploaded documents used for the purpose of ID verification or as credentials, should not include following details:'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: {},  }, xerox: true, items: [
																['Address Information'], ['Phone number'],
																['Place of Birth'], ['Social Insurance Number'],
																['Health or Insurance Numbers'], ['Email'], [
																	'Full ID number such as those on passport, driver license, etc. (',
																	{ tag:'i', items: ['partial or half the numbers should be sufficient to prove the legitimacy of the document, but opt on the side of caution and ask inquiry sources of the documents which of the values could be used'] },
																	')',
																],
															]	}, 
														]
													}, { tag: 'div', props: { className: 'help nope' }, items: [ 
														{ tag: 'b', items: ['IMPORTANT:'] }, 
														' Onus is on you the user to double-check and verify that any sensitive information is removed prior to uploading the document as eVectr will not be liable for any information you release to public on your own accord.',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-10', 
												header: { fixed: true, small: true, label: 'How are Service Provider Ratings and Sale Benchmarks Significant?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['The eVectr rating systems was intended to assist users in assessing both a service provider’s Achieved General Customer Benchmarks (broad number of users who have employed a particular service provider) as well as their Accumulated Customer Satisfaction Score (visually represented as a possible five our five Stars depending on how satisfied each customer was with the service provided) as a contributing factor to deciding which service provider to potentially hire. Both the Achieved General Customer Benchmarks and Accumulated Customer Satisfaction Scores are derived from a survey by the user and service provider at the completion of service contract; meaning service has been provided and transaction has been concluded. To fully comprehend this system, one must first understand the Achieved General Customer Benchmarks and the Accumulated Customer Satisfaction Score separately.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' } }, xerox: true, items: [			
																'Achieved General Customer Benchmarks basically describes when a user achieves an eVectr designated sales benchmark. As a service provider, building trust with another user can be as simple as being successful at what you do. Therefore, achieving a sufficient number of satisfied customers is a feet unto itself and demonstrates that as a service provider you are trustworthy. Furthermore, logic dictates if you weren’t able exhibit such trust, than conceivably you would never have the number of customers that have used your service. As a service provider these benchmark are as followed:',
																{
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: { style: { listStyleType:'lower-roman' } }, xerox: true, items: [
																			['25 Customers or Less (',{tag:'i',items:['Defaulted at Start']},')'],
																			['Achieved at least 100 Customers'],
																			['Achieved at least 500 Customers'],
																		]	}, 
																	]
																}, 
															]	}, 
														]
													}, 
													{ tag: 'p', props: { className: 'text' }, items: ['Used correctly, these benchmarks are meant to serve as a measure to compare one service provider to another; based solely upon the fact they offer the same service (i.e. photographer to photographer). They are NOT meant to compare all service providers arbitrarily, as customer bases differentiate with each respective service. As such, there would be little purpose in comparing the achievement benchmarks of Babysitter to that of a Tour Guide.'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' } }, xerox: true, items: [
																'Accumulated Customer Satisfaction Score describes the accumulated average of a provider’s customer reviews of the service that has incurred. When a transaction is completed, the service user will be prompted to complete a survey of the service provider taking into account their general review of the experience. A main component of this survey will task the service user to score their experience out five possible Stars; filling in each star from left to right, where each Star represents an experience that is:',
																{
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
																			'Very Bad','Bad','Average','Good','Excellent',
																		]	}, 
																	]
																}, 
															]	}, 
														]
													}, 
													{ tag: 'p', props: { className: 'text' }, items: ['As each service providers accrue more transactions, their accumulated and average rating from each customer determines their satisfaction star score. So, if a service provider has 10 customers and they all score 4 out 5 Stars every time (good experience). The accumulated customer satisfaction will be visually represented on their profile as 4 out 5 Stars. Now, if a service provider had 100 customers and their experience ranged from average to excellent. The accumulated customer satisfaction score will be visually represented by the numbers of Stars calculated by the accumulated average of those 100 customers experience rating.'] },
													{ tag: 'p', props: { className: 'text' }, items: ['In most instances, once the search results are populated after a service search, a user is presented with potentially a large number of service providers to choose from. To assist service seekers in making this decision, the previously mentioned Achieved General Customer Benchmarks and Accumulated Customer Satisfaction Scores will help in differentiating the service provider. It is important to remember that, individually the measures mentioned above provide users a some-what decent foundation to choose between one service provider over another. However, using the result of both measures together is ideally the way to help determine which service provider is best suited for your needs. As such, we provide the results of each of these measures simultaneously. Please refer to the below for the description of what this looks like visually:'] },
													{
														tag:	'ul', 	props: {}, items: 	[
															{ tag: 'li', props: { style: { listStyleType:'none' },  }, xerox: true, items: [
																'Accumulated Customer Satisfaction Score will be represented as upwards of five stars on service provider’s profile.',
																'Achieved General Customer Benchmarks will be represented differently in the form of color banners around the Five Star rating on the service provider’s profile. Please refer to the below for the color banner of each designation:',
																{
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
																			['25 Customers or Less (',{tag:'i',items:['banner color bronze']},')'],
																			['Achieved at least 100 Customers (',{tag:'i',items:['banner color silver']},')'],
																			['Achieved at least 500 Customers (',{tag:'i',items:['banner color gold']},')'],
																		]	}, 
																	]
																}, 
															]	}, 
														]
													}, 
													{ tag: 'p', props: { className: 'text' }, items: ['The reasoning behind this decision is to allow the service seeker to see how the information of each measure informs the other. For example, a user may look to compare two service providers one with a 5 out 5 Star rating with a bronze banner while the other has 4 out 5 Star rating with a silver banner. As such, the first service provider has a better Star Rating; meaning his each of his customers reviewed his service much higher than then the other service provider. That said, the banner indicates that the user has far less customers than the other service provider; whereas, the other service provider may have a slightly lower customer satisfaction rating, but has a higher number of overall customers than the first service provider. Based upon just these two measures, the service seeker has enough information to make a decision. Possibly choosing the service provider with slightly lower customer satisfaction score because the larger number of customers infers a level of consistency that other service provider does not. At this point, it is important to remind you the reader, that this is just two determining factors and that there are many others on a service providers profile; including price, credentials, proximity and so forth. Choosing a service provider takes into account the factors that best suit you.'] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-11', 
												header: { fixed: true, small: true, label: 'How to Request a Profile Audit or Reporting a Violation?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['One of eVectr’s primary aims remains the safety and security of all of it users. As such, we encourage any users to report any suspicious activity. This includes, perusing another user profile and reporting false claims or documents, malicious efforts to mislead others for personal gains, conscientious attempts to hide their identity while serving to offer services, etc. Simply, put we want our users to look after the well-being of one another whenever possible. In an effort to best facilitate this measure we offer all of our users the ability to Request a Profile Audit or Report a Violation. Requesting a Profile Audit is simply an appeal to our eVectr Satisfaction Team, when a user suspect’s another of uploading false or misleading documents. The eVectr team will then investigate and contact the user in questions to ensure said documents are verifiable. For those, which cannot be substantiated in meaningful way, we will request removal of the documents. However, should we determine that said user conscientiously made an effort to misinform and otherwise present themselves as something or someone they are not, than they will be immediately banned and their profile removed. The methodology and outcome may be similar for those found accountable in the case of reporting a violation, but this tool was more or less intended to give voice to those wronged in the course of service user/service provider transaction. Access to making these requests can be found for standard users on the Contact Us page and Service Provider/Service User surveys mandated after a transaction.'] },
													{ tag: 'div', props: { className: 'help nope' }, items: [ 
														{ tag: 'b', items: ['IMPORTANT:'] }, 
														' Any attempt to report wrongdoing and violation of any kind via the methods mentioned previously are ANONYMOUS. eVectr wants all users to be able to report any suspicious activity without the fear of repercussions. Punitive action will be dictated by degree or purposeful nature of the violation or not depending on whether user can substantiate their documents and claims.',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-12', 
												header: { fixed: true, small: true, label: 'What is relationship between eVectr and Service Provider? ' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['Service providers are self-employed third-party providers and are not the employees of eVectr. A such, each service provider is considered their own separate business entity and eVectr is the medium in which they advertise, sell and interact with their potential customer base. As such, each service provider is liable for any activities the business participates in (service providers are financially responsible and liable for their own actions).'] },
													{ tag: 'div', props: { className: 'help nope' }, items: [ 
														{ tag: 'b', items: ['IMPORTANT:'] }, 
														' Service providers are all their own separate business entity as such is liable as any business would be. This means that eVectr is not and will not be liable for the actions of the service providers using our platform.',
													]	},
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-13', 
												header: { fixed: true, small: true, label: 'How do I carry-out Transactions? (to-do still)' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['The eVectr rating transaction systems was designed to ensure the security of both the service user and service provider.'] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-14', 
												header: { fixed: true, small: true, label: 'Why and how are the Ads on your Profile Targeted to you?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['We at eVectr believe that transparency is an important aspect of establishing trust. As such, it imperative we explain the source of our targeted advertising because although the platform and its respective services are free to use, we make no intentional claims about altruism. eVectr is a business and as such, we are required generate the necessary profits as any other business would in order to pay staff and continue to develop our software. Therefore, we believe advertising is a necessary drawback in relation to all the benefits the eVectr platform could potentially provide. The source of our targeted advertising is based upon the inputs you provide us. As such, each user could potentially see different ads per the inputs they have provided. eVectr will continue to experiment positioning of such ads as to not inconvenience platform usability, but at the same respects those third-party companies paying us to market their products.'] },
												]
											}
										}, {
											tag: pnl, props: { 
												name:	'question-15', 
												header: { fixed: true, small: true, label: 'Why Are there no inputs for political affiliation or persuasion?' },
												body:	[
													{ tag: 'p', props: { className: 'text' }, items: ['eVectr strives to be as apolitical as possible. The current political climate tends to be one of division; our hope is that our platform brings people together. Yes, one could argue that making searchable input based system that we are trying to highlight current division and a tribal mentality. One could even argue that by adding religion as an input; we are making some type of political stance. This in fact, is not the case; a good majority of inputs are optional including religion and those that are not tend to be location based inputs. The only outlier is hobbies and interests, which is inconsequential to the argument of division; in that it would seem highly unlikely to be a major factor in discounting someone’s opinion and skill set in the case of service provider. That and the fact it is unlikely based upon the inputs we have provided to for an individual to find an exact carbon copy of themselves. Simply, put people may have one or two or three inputs in common with you, but generally speaking they will have inputs that are different as well. In the case, of service seeker searching a service providers, those inputs are not likely to remotely the same. Yet this doesn’t necessarily mean, you as the user will not seek their services or want to interact with another user because they do not have the same input as you. It is in these types of interaction that will bring users together.'] },
													{ tag: 'p', props: { className: 'text' }, items: ['Political affiliation and persuasion in this day in age is a major factor in division. This is why eVectr has chosen not to include political affiliation and persuasion as a user input. Similarly, we will strive to scrutinize and censor any of third-party advertisement that is politically leaning in either direction. Our goal in fact, will be to try to keep any Ads on the eVectr platform apolitical. However, eVectr will not partake in practice of censoring its users unless of course it directly violates our terms and conditions. As such, you are free to express your opinion, political or otherwise without any repercussions. '] },
												]
											}
										}, 
									]; break;;
				case 	 '/safety': res.copy = [
										{
											tag: pnl, props: { 
												name:	'background',
												header: { fixed: true, label: 'Background' },
												body:	[
													{
														tag:	'p', props:	{ className: 'text' },
														xerox: true, items: [
															'The eVectr platform was created with the express purpose of promoting online commerce and social interaction with those with both similar and unique attributes to oneself. Additionally, the platform was intentionally conceived and developed to provide users with control over nearly all aspects of their profile from the information they input to documents they upload. The result is a comprehensive platform for both online and eventual real-life interaction that is made possible by our user customized profile search features.',
															'As with many forms of online commerce and social interaction, there comes a point when remote communication via the platform will no longer suffice. Please remember that it has always been our intention to encourage users to interact in anyway they find suitable; this includes meeting each other in real life when required. As an aside, depending on the Service a user provides, in-person interaction may be a necessity. With that said, we want all our users to interact safely with one another both online and offline.',
															'Please read the information and suggestion for interacting with and eventually meeting with another user in real life and note that we strongly encourage you not to deviate from any instructions as they pertain to your safety and wellness. Nevertheless, you are best judge of what measures you need to take to keep yourself safe and the instructions we provide are not meant to forego your own assessment of any situation that could put you in harm’s way. Moreover, the following guidelines and the subsequent internal platform measure, described within in it are meant to be tools to be used along with your judgment in order to prioritize your safety. Please use them as such.',
															'It is important to remember that the most common interactions on the eVectr platform consist of following scenarios:',
														],
													}, {
														tag:	'ol', 	props: {}, items: 	[
															{ tag: 'li', props: {}, xerox: true, items: [
																[{ tag: 'b', items: ['User to User'] }, '. This scenario describes when one user initially interacts online with another user and that may lead to a potential real-life meeting, but no financial transaction is ever introduced or accepted. This commonly, describes social interaction between users (i.e. users discuss their love of volleyball, which could lead them to meeting up to play the sport).'],
																[{ tag: 'b', items: ['Service Seeker to Service Provider'] }, '. This Scenario describes when a user purposefully seeks the assistance of a service provider and a financial transaction does occur between the two; resulting in a potential real-life meeting (i.e. user may hire translator service provider and gives instructions to attend a specified meeting to translate).'],
																[{ tag: 'b', items: ['Service Provider to Service Seeker'] }, '. This describes the opposite point of view of the previous scenario, where the user is the service provider and he or she has completed the necessary online interactions and intends to meet a service seeker directly. Similarly, this is preceded by transaction payment (i.e. tax expert service provider may seek to meet with their service seeker to collect the necessary documents).'],
															]	}
														],
													}, {
														tag:	'p', props:	{ className: 'text' },
														items:	['The following safety instructions will be an attempt to guide you through each scenario as it pertains to your navigation of eVectr platform leading up to any eventual real-life interaction.'],
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'online-behavior',
												header: { fixed: true, label: 'Online Behavior', subs: [
													{ name: 'personal-info', 	label: 'Personal Information'		},
													{ name: 'ident-verify',  	label: 'Identify Verification'		},
													{ name: 'ident-redflag', 	label: 'Identify Red Flags'			},
													{ name: 'protect-finance', 	label: 'Protect Your Finances'		},
													{ name: 'be-inquisitive', 	label: 'Be Inquisitive'				},
													{ name: 'reporting', 		label: 'Report Suspicious Behavior'	},
												]	},
												body:	[
													{
														tag:	blk, props:  { 
															name: 	'personal-info', 
															header: { fixed: true, label: 'Personal Information' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	xerox: true, items: [
																		'Users should be careful of revealing the types of personal information that any disreputable person could use online for their own gains at your expense. As such, when a user interacts with another user in sphere of social interaction; under NO circumstances should they be providing sensitive personal information such credit card numbers, social insurance number and banking information to one another. When it comes to personal addresses, emails or phone numbers a user should use their own discretion and work to get to know who they are interacting with; prior to revealing such details.',
																		'As a user seeking a service, the possibility of a transaction is inevitable. However, this does not necessarily require a user to provide any of their personal financial information directly to the service provider and the same would be true if a user was service provider dealing with a potential customer. In fact, eVectr provides users with comprehensive billing system to assist with any transaction and such personal financial details are not directly released to either party. That said, depending on the type of service sought a user may need to provide some personal information such as their address or phone number as required (i.e. Seeking the service of personal cook will require them to access your home to cook the food you requested).',
																		'Lastly, users should never provide their user login and passwords for their eVectr profile to anyone they do not trust. In our ever-connected online world, a lot of damage can be done by someone posing as you. It is up to you to make it difficult for anyone trying to do this by keeping your login credentials secured. As a reminder, eVectr will never ask you via email to provide your username and password. Should such request be sent, please report such suspicious communiqué, so we can swiftly address the issue and warn our other users of such activities.',
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'ident-verify', 
															header: { fixed: true, label: 'Identifying User Verification' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	xerox: true, items: [
																		'We at eVectr understand that the vast majority of our users intend to use our platform as it was intended. However, we do recognize the possibility of misuse. Especially, from a motivated minority of users intending to otherwise lie and misrepresent for their own ill-gotten gains. As such, we recommend user interact in manner that takes this into account and adopt a “trust but verify” mentality.',
																		'eVectr has added specified input options on a user’s settings page titled Public Identity Verification Measure. This section was created to both assist you in determining the validity of another user’s identity and for others to determine your identity. In fact, it is recommended that all users, including yourself; take the time to input and upload this information either during the initial registration process or some short time after. This section specifically requests that person provides three current photos, which can assist others in identifying what they look like as well as the option to add either corroborative links of the users other social network pages (i.e. Facebook, LinkedIn, Instagram, etc.) or to upload some type of valid photo ID with  any secured details removed (a user can take a photo of their passport and blackout full passport number, their address, DOB, etc.) for the purpose of name verification. As an eVectr user, you should be weary of any profile that refuses to meet the requirement of the Public Identity Verification Measure as it can be indicative of someone going out their way to be less transparent and forthcoming.',
																		'Prior to even attempting to interact with another user in real life, one determining factor should always be; whether the person you intend to meet has ensured his or her identity can be verified within the parameters provided by eVectr. Honest and genuine users’ typically have no reasons to hide their identity from you. This feature becomes especially important when you start interacting with a service provider or as a service provider you interact with a potential customer.',
																		'The fact is, performing a transaction requires a great deal of trust and establishing trust requires the two parties to know who they will be dealing with. As such, if you registered to become service provider; in order to meet the criteria of a full security rating (represented the four shields on a service provider’s public profile); you must input your qualifications credentials documents as well as ensure you have uploaded the necessary requirements for the Public Identity Verification Measure. Now, you will need to bear in mind confirming your identity only cover one criterion out of four others (see Users/Service Provider Ratings and How it is Calculated? section in the terms and condition) in order to achieve a full rating. It is important however, to remind you that the first shield out of four designates that identity verification requirement has been fulfilled by Service Provider. Similarly, the first star indicates the same for standard user or service seeker.',
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'ident-redflag', 
															header: { fixed: true, label: 'Identifying Possible Red Flags' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	items: [
																		'Knowing and understanding the measure mentioned above will allow you to make a better determination of the trustworthiness of thee individual. That said, simply fulfilling the previous measure is not a guarantee that a person is who they say they are. In fact, we advise that you don’t look to a single measure as the determining factor for trusting and interacting with another user online. Be diligent when you interact with another user and look for potential red flags both within the eVectr platform and externally, which you may consider disqualify factors to further interactions. The below represents a list potential red flags that we at eVectr, think you should consider when interacting with another user (in no specific order):',
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'protect-finance', 
															header: { fixed: true, label: 'Protect Your Finances' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	items: [
																		'Be extremely careful of any interaction between users that do not have service provider status on their profile, which results in a request for money. As a general rule, you should never respond to a request to send money whether it’s locally or internationally. In fact, we highly encourage users to keep to using the eVectr provided transaction applications for the sake of traceability and record keeping purposes. There is very little eVectr will be able to do to assist on disputes that are cashed based and as such skirt traditional tax obligations. Please note that using the transaction tools as intended will also ensure incremental increases in your user rating and the status associated with achieving certain sales benchmarks but as a service provider. On the other hand, as a service user this means increase your user rating that and thus will encourage other service provider to accept you as customer. Regardless of your user status, it is your best interest to keep transactions exclusively on the platform.',
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'be-inquisitive', 
															header: { fixed: true, label: 'Be Inquisitive, Get to Know the Other User, and be Platform-Savvy' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	xerox: true, items: [
																		'Perform the necessary research required to make you feel safe when interacting with another user. eVectr has encouraged all its user to be as transparent as they can be within the confines of our system. However, if you believe this still insufficient, perform your own due diligence and take the time to get to know the other user. Ask questions; push to have your fears alleviated by the user you are interacting with. In the case of a legitimate service provider, he or she should have nothing to hide and as status would entail; self promotion is a part of what they signed up for. As such, any user performing major pushback to verifying their basic identity information or their qualifications is someone you probably shouldn’t be interacting with either online or in person.',
																		'Use the eVectr user blocking functionality whenever required. We have enabled the user blocking features to ensure that you only have to interact with those you feel comfortable with. If a user or service provider says something to rings any alarms. Trust those instincts and block them as a contact. If the nature of the communications gets to the point of violating eVectr’s identified code of conduct, then proceed with reporting the users so that our team can investigate to ensure not only your safety but those of all users on the platform.',
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'reporting', 
															header: { fixed: true, label: 'Report All Suspicious Behavior' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	xerox: true, items: [
																		'All users must remain ever diligent when it comes to their own safety and to ensure that of other users on the platform. eVectr provides multiple avenues to the reported suspicious users, poor service, improper transactions and so forth. These features were created for the purpose of trying to ensure the safety of all users, but these features are only affective measure when suspicious behavior is reported.',
																		'Furthermore, please report anyone who violates our terms and conditions. For example, this includes any upload, post, email, transmit or otherwise make available any material that is:',
																	],
																}, {
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: { type: 'i' }, xerox: true, items: [
																			'unlawful, harmful, threatening, abusive, harassing, tortuous, defamatory, vulgar, obscene, pornographic, libelous, invasive of another\'s privacy, hateful, or racially or ethnically objectionable, encourages criminal behavior, gives rise to civil liability, violates any law, or is otherwise objectionable;',
																			'forge headers or otherwise manipulate identifiers in order to disguise the origin of any material transmitted to or through the Website or impersonate another person or organization;',
																			'contains any falsehoods or misrepresentations or create an impression that You know is incorrect, misleading, or deceptive, or any material that could damage or harm minors in any way; and',
																			'impersonate any person or entity or misrepresent their affiliation with a person or entity.',
																		]	}
																	],
																}, 
															],
														}
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'offline-behavior',
												header: { fixed: true, label: 'Offline Behavior', subs: [
													{ name: 'safeguards', 		label: 'Prepare Safeguards', },
													{ name: 'reactive-measure', label: 'Reactive Measures',  },
												]	},
												body:	[
													{
														tag:	blk, props:  { 
															name: 	'safeguards', 
															header: { label: 'Prepare the Necessary Safeguards Prior to Meeting Another User In-Person' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	items: ['Being Proactive and taking the necessary steps prior to meeting another user will help to alleviate any concerns and ensure your safety. Remember, the proceeding measures are relevant to meeting another user socially for the first time, but may not be applicable for every kind of service provider and it entirely depends on the service they provide. Nevertheless, we recommend all users read these safeguards certain aspect may still be considered viable measures to ensuring your safety. The following safeguards include:'],
																}, {
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: { type: 'i' }, xerox: true, items: [
																			[{ tag: 'b', items: ['Providing any trustworthy third party the meeting information'] }, '. Inform a friend or family member that you intend to meet another user. Provide the information of the user, such as full name, link to his or her profile and ensure the person you are trusting with this information verifies for themselves that the user identity verification measures have been fulfilled (Third party is aware of what the user your meeting looks like) as well as time and place of the meeting.'],
																			[{ tag: 'b', items: ['Have your third-party contact you at a pre-determine time after the meeting'] }, '. Ensure your fried or family contacts you after the designated meeting time to make sure there were no issues. Make sure this detail is relayed to the user you are planning on meeting. Any user without a hidden agenda will not take offense and would not try to dissuade you from this measure.'],
																			[{ tag: 'b', items: ['Whenever possible take your own form of transportation'] }, '. Taking your own transportation is one element control in your favor. This allows you to leave whenever possible and quickly get out a situation you are not comfortable with.'],
																			[{ tag: 'b', items: ['Try to bring someone with you on an initial meeting'] }, '. Bringing someone else with you is another element within your control. The benefit of bring someone with you is having a witness or another person to gauge and evaluate the situation.'],
																			[{ tag: 'b', items: ['Plan to meet in a public place'] }, '. Meeting in public place will ensure the security of having other people around you. Always try to meet in public to hammer out any remaining details for the service; especially, in the case of service providers that eventually know where you are living (babysitter, dog walker, cleaner, painters, in home cooks, etc.). Take the opportunity to get know the user during the initial meeting and provide them any sensitive information after you feel comfortable to do so.'],
																		]	}
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'reactive-measure', 
															header: { label: 'Reactive Measures for Negative Real-World Interactions/Transactions' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	items: ['Please keep in mind, this is only relevant in the case where a real-world interaction was necessary and presumably the circumstance of the direct encounter resulted in a negative experience. Should such an incident occur under these parameters, there is a reactive measure that a user should consider taking in order to prevent others from having the same experience; such as:'],
																}, {
																	tag:	'ul', 	props: { style: { listStyleType:'none' } }, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			[{ tag: 'u', items: ['Perspective: User to User'] }, br,br, { tag: 'b', items: ['Be sure to Report a Violation'] }, '. In the case of negative experience, that occurred while you were meeting another user; which subsequently resulted in suspicious activity or violation of the eVectr code of conduct. Please proceed to navigate to the contact us page, on that page we have provided the necessary options to Report a Violation, which our eVectr User Satisfaction team will investigate to determine the best course of action.'],
																			[{ tag: 'u', items: ['Perspective: Service User to Service Provider'] }, br,br, { tag: 'b', items: ['Be sure to complete designated service provider survey'] }, '. The service provider survey performs multiple functions; not only does performing these surveys provide the necessary review of the service (in this case a negative rating), but it also provides service users with the means to Report a Violation or Request an Audit of the credentials on a service provider’s profile. Submitting either of these requests will initiate an investigation by the eVectr User Satisfaction team and if necessary apply the required punitive actions. Please refer to eVectr’s frequently asked questions for a bit more detail, under What is the Significance of the eVectr User Surveys?'],
																			[{ tag: 'u', items: ['Perspective: Service User to Service Provider'] }, br,br, { tag: 'b', items: ['Be sure to complete designated service user survey'] }, '. The service user survey provides a required review of the service user, but it also provides service users with the means to report a violation. In this particular scenario, a service provider should provide a user a negative rating which accumulatively will serve to warn other service providers of this user’s behavior. In the rare case of a major violation, proceed with to Report a Violation and our eVectr User Satisfaction team will investigate occurrence and determine if further actions are required.'],
																		]	}
																	],
																}, 
															],
														}
													}, 
												],		
											}
										},
									]; break;;
				case 	'/privacy': res.copy = [
										{
											tag: pnl, props: { 
												name:	'background',
												header: { fixed: true, label: 'Background' },
												body:	[
													{
														tag:	'p', props:	{ className: 'text' },
														items: 	['eVectr Services Inc. and its affiliates are committed to maintaining the privacy of individuals and protecting personal information in its custody or control and complying with applicable privacy legislation. For the purposes of this Privacy Policy, "personal information" means information about an identifiable individual but does not include a business title or contact information when used to contact an individual in their business capacity or information that could not identify an individual.'],
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'application',
												header: { fixed: true, label: 'Application', subs: [
													{ name: 'opt-out', label: 'Method to Opt-Out' 	},
													{ name: 'consent', label: 'Consent' 			},
												]	},
												body:	[
													{
														tag:	'p', 		props: { className: 'text' },
														items: 	['This Privacy Policy is a summary of eVectr’s privacy practices and guidelines governing the provision of products and services but does not apply to personal information related to potential, current or former employees or contractors of eVectr.'],
													}, {
														tag:	blk, props:  { 
															name: 	'opt-out', 
															header: { fixed: true, label: 'Method to Opt-Out' },
															items: 	[
																{
																	tag:	'p', 	props: { className: 'text' }, xerox: true, items: [
																		'If you do not agree with any part of this Privacy Policy you should not conduct any transactions on this Website or the App and navigate away from this page immediately.',
																		'In certain circumstances the personal information we collect and maintain may include:',
																	]
																}, {
																	tag: 'ul', props: {}, items: [
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'your name, address, telephone number, email address or other information to contact or identify you;',
																			'information about the goods or services provided to or by you; ',
																			'information about your transactions while using our platform, including bills, credit history, payment preference, billing and credit card information, and other details and preferences; ',
																			'information from communications with you, including your feedback and requests for customer care;',
																			'where required by law to do so;',
																			['site activity information and cookies (',{ tag: 'i', items: ['see below'] },'), and;'],
																			'voluntary information provided by you, which may include service provider reviews and ratings, referrals, special instructions, feedback, and other actions performed on the Website or App.',
																		]	}
																	]
																}
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'consent', 
															header: { fixed: true, label: 'Consent' },
															items: 	[{
																tag:	'p', 	props: { className: 'text' }, xerox: true, items: [
																	'If you choose to voluntarily submit personal information to us, we will consider that you have consented to our collection, use and disclosure of this personal information for purposes reasonably related to your providing the information and for the purposes set out in this Privacy Policy.',
																	'Where we use the services of third parties in our business they may provide us with your personal information. In such a situation, we will make reasonable efforts to have such parties assure us that this provision of your information is permitted. Subject to the above, we will usually ask for your consent when we collect your personal information. Sometimes this may happen after collection but prior to our use or disclosure of your personal information.',
																	'If we plan to use or disclose your personal information for a purpose not disclosed in this Privacy Policy or elsewhere to you, we will make efforts to let you know about that purpose before use or disclosure. Since we utilize the services of third-party food service providers and third-party independent courier contractors, we share your information to facilitate the Service. This may include sending emails or text notifications, processing payments, placing orders, sending delivery instructions, and providing superior customer service. We require that our third-parties commit to use this information for the sole purpose of fulfilling the Service.',
																	'You may modify or revoke your consent at any time, with reasonable notice, subject to applicable laws and contracts signed by you, by sending a written message to our Privacy Officer. In some circumstances, a modification or revocation of consent may limit or prevent us from providing products or services to, or acquiring products or services from you. We assume, unless you tell us otherwise, that by continuing to deal with us after having had this Privacy Policy made available to you that you consent to the collection, use and disclosure of your personal information as set out and for the purposes described in this Privacy Policy, where such consent is required by law.',
																]
															}],
														}
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'cookies',
												header: { fixed: true, label: 'Use of Cookies', subs: [
													{ name: 'what-cookies', 		label: 'What Are Cookies?' 		},
													{ name: 'refuse-cookies', 		label: 'How to Refuse Cookies?'	},
													{ name: 'third-party-cookies', 	label: 'Third-Party Cookies?' 	},
												]	},
												body:	[
													{
														tag:	blk, props:  { 
															name: 	'what-cookies', 
															header: { fixed: true, label: 'What Are Cookies?' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['We use a browser feature called a cookie to collect information anonymously and track user patterns on the site. A cookie is a small text file that is placed on your hard disk by a web site and contain a unique identification number that identifies your browser, but not you, to our computers each time you visit the site. Cookies tell us which pages of our web site are visited and by how many people. The information that cookies collect includes the date and time of your visit, your registration information, session identification number, and your navigational history and preferences.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'refuse-cookies', 
															header: { fixed: true, label: 'How to Refuse Cookies?' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['The use of cookies is an industry standard and many major browsers are initially set up to accept them. You can reset your browser to either refuse to accept all cookies or to notify you when you have received a cookie. However, if you refuse to accept cookies, you may not be able to use some of the features available on the site.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'third-party-cookies', 
															header: { fixed: true, label: 'Third-Party Cookies?' },
															items: 	[
																{
																	tag:	'p', 	props: { className: 'text' }, xerox: true, 
																	items: 	[
																		'Some third-party services providers may use cookies on our site. We have no control over those cookies and they are not covered by this Privacy Policy.',
																		'eVectr uses cookies and similar technologies for purposes of:',
																	],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'Authenticating users.',
																			'Remembering user preferences and settings.',
																			'Determining the popularity of content.',
																			'Delivering and measuring the effectiveness of advertising campaigns.',
																			'Analyzing site traffic and trends, and generally understanding the online behaviors and interests of people who interact with our services.',
																		]	}
																	],
																}, {
																	tag:	'p', 	props: { className: 'text' },
																	items: 	['We may also allow others to provide audience measurement and analytics services for us, to serve advertisements on our behalf across the Internet, and to track and report on the performance of those advertisements. These entities may use cookies, web beacons, SDKs, and other technologies to identify your device when you visit our site and use our services, as well as when you visit other online sites and services.'],
																}
															],
														}
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'collection',
												header: { fixed: true, label: 'What We Collect', subs: [
													{ name: 'info-types', 	label: 'Types of Information' },
													{ name: 'services', 	label: 'Services & Features' },
													{ name: 'support', 		label: 'Customer Support' },
													{ name: 'rnd', 			label: 'Research & Development (R&D)' },
													{ name: 'comm-user', 	label: 'Communication Among Users' },
													{ name: 'comm-evectr', 	label: 'Communication from eVectr' },
													{ name: 'legal', 		label: 'Legal Proceedings & Requirements' },
													{ name: 'accuracy', 	label: 'Accuracy & Completeness' },
												] 	},
												body:	[
													{
														tag:	blk, props:  { 
															name: 	'info-types', 
															header: { fixed: true, label: 'Types of Information' },
															items: 	[
																{
																	tag:	'p', props:	{ className: 'text' },
																	items: 	['Information collected when you use our services may include:'],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			[{ tag: 'b', items: ['Aggregate Information'] 	}, br,br, 
																				'eVectr data collection strives to develop aggregate information of users rather that of any individual user. All eVectr profiles are public, hence the information you the user selects and inputs is available for all to see. eVectr only collects and stores the information you have inputted. That said, aggregate data segmented by users’ input is considered significant and we collect this information for the purpose of optimizing and maximizing the effectiveness of the Ads space we sell to third parties (i.e. targeted ads for Tennis equipment directed at users who include playing Tennis as a hobby or interest). eVectr may release to third-parties aspect of the aggregate data in relations to activities in our sales division. However, ',
																				{ tag: 'span', props: { className: 'epon' }, items: ['EVECTR DOES NOT SELL OR RELEASE TO ANY THIRD PARTY SPECIFIC PERSONAL DATA WITH RESPECT TO ANY INDIVIDUAL USER.'] }
																			],
																			[{ tag: 'b', items: ['Location Information'] 	}, br,br, 'eVectr utilizes your IP information to determine the city that you are in. Subsequent, location information is only collected if you the user input further details into your profile that is relevant to the activities you intend to use the platform for (i.e. Service Provider, Utilization of Social Networking capabilities). Such, information is added at the user discretion and is not mandated by eVectr.'],
																			[{ tag: 'b', items: ['Transaction Information'] }, br,br, 'eVectr collects relevant user to user (Service Provider) transaction details, which include the type of service ordered, date and time of the service, the amount paid for said service and the method of payment.'],
																			[{ tag: 'b', items: ['Survey Information'] 		}, br,br, 'eVectr utilizes the information it collects from surveys after the completion of transactions. Specifically, the user and service provider’s rating or review information and the numbers or sales made by individual user (Service Provider).'],
																			[{ tag: 'b', items: ['Usage information'] 		}, br,br, 'eVectr collects information on how you use our platform. Specifically, browser information dates and times in which access and log out of the platform, search perform within the platform, features most utilized, and platform application crashes. This collection is performed through the use of cookies, pixel tags, and similar technologies that create and maintain unique identifiers. To learn more about these technologies, please see our Cookie Statement.'],
																			[{ tag: 'b', items: ['Device Information'] 		}, br,br, 'eVectr collects information about the devices you use to access our services, including the hardware models, device IP address, operating systems and versions, software, file names and versions, preferred languages, unique device identifiers, advertising identifiers, serial numbers, device motion information, and mobile network information.'],
																			[{ tag: 'b', items: ['Communications Data'] 	}, br,br, 'eVectr collects relevant data when you receive text, emails and phone calls as well as when you use the platform messaging and chatting features for the purpose of user to user communication, profile authentication and or seeking support assistance. We use this information to determine date and times of specific communiqué, frequency of use, as well as cataloguing common issues and complaints for the purpose of improving the platform and all its essential features.'],
																			[{ tag: 'b', items: ['User Uploaded data'] 		}, br,br, 'eVectr collects and stores the information that you upload to your profile. This includes any relevant documentation that serve as credentials (licenses, accreditation, certificates, etc.) as well as security and identification documents (background checks, bondability credentials, driver’s license or other identification). It is important to remember that eVectr profiles are publicly viewable as such our collection of this data is immaterial and its storage only serves to benefit user to user activity.'],
																		]	}
																	],
																}, 
															]
														}
													}, {
														tag:	blk, props:  { 
															name: 	'services', 
															header: { fixed: true, label: 'Services & Features' },
															items: 	[
																{
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['eVectr uses the information we collect to provide, personalize, maintain and improve our products and services. This includes using the information to:'],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'create and update your account;',
																			'verify your identity as an authorized user concerning any accounts, and to implement, carry out and maintain security measures aimed at protecting our customers from identity theft, fraud and unauthorized access to accounts;',
																			'verify your identity;',
																			'nnable your ability to offer or purchase services;',
																			'process or facilitate payments for those services;',
																			'provide and administer services and monitor your purchases, fees paid and payable, payment history, parties to transactions, payments and payment card usage;',
																			'perform user surveys in order gauge the need for further features to meet the expectations of all users as well as evaluate opportunities for the business as a whole;',
																			'comply with legal or regulatory requirements (including those related to security);',
																			'promote and market products and services offered by us;',
																			'promote product and services offered by other users;',
																			'promote products and services by third parties;',
																			'enable features that allow you to share information with other people, such as when you submit a compliment to service provider and refer friends to use the eVectr platform;',
																			'enable features to personalize your eVectr account, such as creating bookmarks for your favorite services providers, and to enable quick access to previous destinations;',
																			'perform internal operations necessary to provide our services, including troubleshooting software bugs and operational problems, to conduct data analysis, testing, and research, and to monitor and analyze usage and activity trends, and;',
																			'to respond to inquiries from you.',
																		]	}
																	],
																}, {
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['Except as required for the foregoing, or as required or permitted by applicable law, eVectr does not disclose personal information to third parties without your prior consent.'],
																}, 
															]
														}
													}, {
														tag:	blk, props:  { 
															name: 	'support', 
															header: { fixed: true, label: 'Customer Support' },
															items: 	[
																{
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['eVectr uses the information we collect (including recordings of customer support calls after notice to you and with your consent) to assist you when you contact our customer support services, including to:'],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'Direct your questions to the appropriate customer support person',
																			'Investigate and address your concerns',
																			'Monitor and improve our customer support responses',
																		]	}
																	],
																}
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'rnd', 
															header: { fixed: true, label: 'Research & Development (R&D)' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['We may use the information we collect for testing, research, analysis and product development. This allows us to improve and enhance the safety and security of our services, develop new features and products, and facilitate insurance and finance solutions in connection with our services.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'comm-user', 
															header: { fixed: true, label: 'Communication Among Users' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['eVectr uses information we collect to enable communications between our users. For example, a user may use eVectr communication features to send message and open a chat with a service provider for a time or place to meet.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'comm-evectr', 
															header: { fixed: true, label: 'Communication from eVectr' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['eVectr uses the data it collects to communicate with its features, services, promotions, studies, surveys, news, updates and events. Similarly, we use this information to promote and process contests and sweepstakes, fulfill any related awards, and serve you relevant ads and content about our services and those of our business partners. You may receive some of these communications based on your profile as a user.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'legal', 
															header: { fixed: true, label: 'Legal Proceedings & Requirements' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['We may use the information we collect to investigate or address claims or disputes relating to your use of eVectr platform, or as otherwise allowed by applicable law, or as requested by regulators, government entities, and official inquiries.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'accuracy', 
															header: { fixed: true, label: 'Accuracy & Completeness' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['When we collect, use or disclose personal information, we will make reasonable efforts to ensure that it is accurate, up to date, and complete. This may involve requesting further information or updates from you. We do request that you advise us of changes to your personal information so that our records may remain current.'],
															}],
														}
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'by-design',
												header: { fixed: true, label: 'Privacy by Design',  subs: [
													{ name: 'breaches', 		label: 'Breach Notification' 	},
													{ name: 'right-to-access', 	label: 'Right to Access' 		},
													{ name: 'security', 		label: 'Security' 				},
													{ name: 'other-sites', 		label: 'Other Websites' 		},
												] 	},
												body:	[
													{
														tag:	'p', props:	{ className: 'text' },
														items: 	['eVectr to adheres to the principle of Privacy by Design, which calls for the inclusion of data protection from the onset of the designing of systems, rather than an addition. More specifically –– The controller shall implement appropriate technical and organisational measures in an effective way. Therefore, we only to hold and process data absolutely necessary for the completion of its duties (data minimisation) and limit the access to personal data to those needing to act out the processing (EUGPR.org).'],
													}, {
														tag:	blk, props:  { 
															name: 	'breaches', 
															header: { fixed: true, label: 'Breach Notification' },
															items: 	[
																{
																	tag:	'p', 	props:	{ className: 'text' }, xerox: true,
																	items: 	[
																		'The law allows us, for legal or business purposes, to retain personal information for as long as is reasonable. Upon expiry of an appropriate retention period, bearing in mind reasonable legal and business requirements, personal information will either be destroyed in a secure manner or made anonymous.',
																		'You should be aware that there may be legally required minimum retention periods, which we must and do observe. Should any consent, where consent is required, to our collection, use, disclosure or retention of personal information be revoked, the law also allows us to continue to retain the information for as long as is reasonable for legal or business purposes.',
																		'In the event that revocation of any required consent may have consequences to the individual concerned, we will advise the individual of the consequences of revoking their consent where it is reasonable in the circumstances to do so.',
																		'As an eVectr user, upon request of the user, we offer:',
																	],
																}, {
																	tag:	'ol', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'The right to remove personal data; stop further distribution of said data as well as within our abilities to do so stop any third parties further releasing data relevant to you a user. However, such request must be made on the condition, the data no longer being relevant to original purposes for processing, or a data subjects withdrawing consent. It should also be noted that this right requires controllers to compare the subjects\' rights to "the public interest in the availability of the data" when considering such requests (EUGPR.org).',
																			'The right for a data subject to receive the personal data concerning them, which they have previously provided in a "commonly use and machine-readable format" and have the right to transmit that data to another controller (EUGPR.org).',
																		]	}
																	],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'right-to-access', 
															header: { fixed: true, label: 'Right to Access' },
															items: 	[
																{
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['The law permits individuals to submit written requests to us to provide them with:'],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'access to their personal information, if any, under our custody or control;',
																			'information about the purposes for which their personal information under our custody or control has been and is being used by us; and ',
																			'the names of persons or entities to whom, and the circumstances in which, their personal information has been and is being disclosed by us.',
																		]	}
																	],
																}, {
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['We would also note that your ability to access your personal information under our control is not absolute and we reserve all our legal rights to not disclose personal information should we be of the view that it is not appropriate or reasonable to do so.'],
																}, {
																	tag:	'h5', 	props: {},
																	items: 	['Responses to Requests for Access to Personal Information'],
																}, {
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['Our response to requests for access to personal information will in all cases be in writing, and will confirm whether we are providing all or part of the requested information, whether or not we are allowing access or providing copies, and, if access is being provided, when that will be given. If access or copies are refused by us, we will provide written reasons for such refusal and the section of The Personal Information Protection and Electronic Documents Act or other applicable privacy legislation on which that refusal is based, along with the name of the person at eVectr who can answer questions about the refusal, and particulars of how the requesting individual can ask the Information and Privacy Commissioner of Canada or other applicable regulator to review our decision.'],
																}, {
																	tag:	'h5', 	props: {},
																	items: 	['Requests for Correction of Personal Information'],
																}, {
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['The law permits individuals to submit written requests to us to correct errors or omissions in their personal information where that information is in our custody or control. We do require that all such requests be in writing, with no exceptions, and email is not considered to be in writing. We reserve the right to require sufficient information and detail from the individual in question in order to properly locate the information and provide a response. In the event that an individual alleges inaccuracies, errors or omissions in the personal information in our custody or control, we will either:'],
																}, {
																	tag:	'ul', 	props: {}, items: 	[
																		{ tag: 'li', props: {}, xerox: true, items: [
																			'correct the personal information and, if reasonable to do so, send correction notifications to any other organizations to whom we disclosed the incorrect information; or',
																			'decide not to correct the personal information but annotate the personal information that a correction was requested but not made.',
																		]	}
																	],
																}, {
																	tag:	'p', 	props:	{ className: 'text' },
																	items: 	['Corrections or amendments will not be made to opinions, including expert or professional opinions, as opposed to factual information, which may be corrected if in error.'],
																}, 
															],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'security', 
															header: { fixed: true, label: 'Security' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['We recognize our legal obligations to protect personal information collected during the course of carrying on business. We have therefore made reasonable arrangements to secure against the unauthorized access, collection, use, disclosure, copying, modification, disposal, or destruction of personal information. All interactions with our services use the Transport Layer Security/Secure Sockets Layer (TLS/SSL) protocol. We use a third-party, industry-accepted Payment Gateway to securely process credit card transactions.'],
															}],
														}
													}, {
														tag:	blk, props:  { 
															name: 	'other-sites', 
															header: { fixed: true, label: 'Other Websites' },
															items: 	[{
																tag:	'p', 	props:	{ className: 'text' },
																items: 	['Please note that our website and our online services may contain links to other websites which are provided as a convenience for visitors to our website or users of our services only. Any third-party websites will have their own privacy policies and practices, and we cannot be responsible for such third parties or their websites.'],
															}],
														}
													}, 
												],		
											}
										}, {
											tag: pnl, props: { 
												name:	'misc',
												kind:	'full',
												header: { fixed: true, label: 'Miscellaneous', subs: [
													{ name: 'amendment', 	label: 'Amendment of Policy' },
													{ name: 'contacting', 	label: 'Contacting Us' },
												] 	},
												body:	[
													{
														tag:	blk, props:  { 
															name: 	'amendment', 
															header: { fixed: true, label: 'Amendment of Policy' },
															items: 	[{
																tag:	'p', props:	{ className: 'text' },
																items: 	['We reserve the right to amend this Privacy Policy from time to time as required and without notice by posting an amended version on our website.'],
															}]
														}
													}, {
														tag:	blk, props:  { 
															name: 	'contacting', 
															header: { fixed: true, label: 'Contacting Us' },
															items: 	[{
																tag:	'p', props:	{ className: 'text' },
																items: 	[
																	'If you have any questions with respect to our policies concerning the handling of your personal information, or if you wish to request access to, or correction of, your personal information under our care and control, please see our ',
																	{ tag: 'a', props: { href: '/about#contact-us' }, items: ['About Us'] }, ' page.',
																],
															}]
														}
													}, 
												],		
											}
										}, 
									]; break;;
				case 	  '/terms': res.sidebar = [
					{ small: true, href: '#acceptance', 			label: 'Acceptance of Agreement' }, 
					{ small: true, href: '#the-service', 			label: 'The Service' }, 
					{ small: true, href: '#eligibility', 			label: 'Eligibility' }, 
					{ small: true, href: '#privacy-policy', 		label: 'Privacy Policy' }, 
					{ small: true, href: '#account-terms', 			label: 'Account' }, 
					{ small: true, href: '#license', 				label: 'LICENSE TO USE' }, 
					{ small: true, href: '#user-inputs', 			label: 'User Profile & Information Inputs' }, 
					{ small: true, href: '#payments', 				label: 'Purchasing Services & Payments' }, 
					{ small: true, href: '#survey', 				label: 'User Surveys' }, 
					{ small: true, href: '#security-badges', 		label: 'Security Badges' }, 
					{ small: true, href: '#uploads', 				label: 'User-Uploaded Material' }, 
					{ small: true, href: '#interaction', 			label: 'Interaction Code of Conduct' }, 
					{ small: true, href: '#standards', 				label: 'User Conduct Standards/Violations' }, 
					{ small: true, href: '#blocking', 				label: 'Blocking Other Users' }, 
					{ small: true, href: '#punitive-actions', 		label: 'Punitive Actions' }, 
					{ small: true, href: '#reporting', 				label: 'Audit Request/Report Violation' }, 
					{ small: true, href: '#services-incurred',		label: 'Services Incurred' }, 
					{ small: true, href: '#pricing-refunds', 		label: 'Service Pricing & Refunds' }, 
					{ small: true, href: '#processing', 			label: 'Processing Orders' }, 
					{ small: true, href: '#taxes', 					label: 'Service Provider Business/Taxes' }, 
					{ small: true, href: '#content-terms', 			label: 'Content' }, 
					{ small: true, href: '#advertisement', 			label: 'Advertisement' }, 
					{ small: true, href: '#verification-material',	label: 'Verification Material' }, 
					{ small: true, href: '#rights-grants', 			label: 'Rights eVectr Grants to You' }, 
					{ small: true, href: '#restrictions', 			label: 'Restrictions' }, 
					{ small: true, href: '#safety', 				label: 'Safety & Interactions' }, 
					{ small: true, href: '#ending-terms', 			label: 'Ending the Terms' }, 
					{ small: true, href: '#disclaimers', 			label: 'Liability Disclaimers/Limitations' }, 
					{ small: true, href: '#general', 				label: 'General' },
				];
				res.copy = [
					{
						tag: pnl, props: { 
							name:	'acceptance',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Acceptance of Terms of Use Agreement' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['By creating an eVectr account, whether through a mobile device, mobile application or computer (collectively, the “Service”) you agree to be bound by:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['these Terms of Use;'],
											['our Privacy Policy and Safety Tips, each of which is incorporated by reference into this Agreement; and'],
											['any terms disclosed to you if you purchase or have purchased additional features, products or services we offer on the Service (collectively, this “Agreement”).'],
										]	}, 
									]
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['If you do not accept and agree to be bound by all of the terms of this Agreement (other than the limited one-time opt out right for certain users provided for in Section 16), you should not use the Service.'],
										['We may make changes to this Agreement and to the Service from time to time. We may do this for a variety of reasons including to reflect changes in or requirements of the law, new features, or changes in business practices. The most recent version of this Agreement will be posted on the Service under Settings and also on evectr.com, and you should regularly check for the most recent version. The most recent version is the version that applies. If the changes include material changes that affect your rights or obligations, we will notify you in advance of the changes by reasonable means, which could include notification through the Service or via email. If you continue to use the Service after the changes become effective, then you agree to the revised Agreement. You agree that this Agreement shall supersede any prior agreements (except as specifically stated herein), and shall govern your entire relationship with eVectr, including but not limited to events, agreements, and conduct preceding your acceptance of this Agreement.'],
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'the-service',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'The Service' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['eVectr is a technology platform comprising of web and mobile applications that serves as an intermediary to connect users with common inputted characteristics to others with the same distinctions and or users with services to offer, to those seeking to purchase and utilize said services. Specifically, the eVectr platform employs a social networking framework to facilitate user to user communication as well as service-based commerce. All registered service providers utilizing this platform are independent third-party providers under agreement with eVectr or specified eVectr affiliates (“Third Party Providers”) to only offer eVectr certified services. Unless otherwise agreed upon by either eVectr and or the register service provider (“Third Party Providers”); services offered are available for your personal and not commercial usage.'],
										['By reading and agreeing to these Terms and conditions:'],
										['YOU ARE ACKNOWLEDGING THAT EVECTR DOES NOT PROVIDE ANY SERVICE BEYOND THAT OF BEING THE INTERMEDIARY BETWEEN YOU AND OTHER USERS AND OR SERVICE PROVIDERS. YOU ALSO ACKNOWLGE THE FACT THAT SERVICE PROVIDERS ARE SELF-EMPLOYED THIRD-PARTY VENDORS AND ARE NOT UNDER THE EMPLOYMENT OF EVECTR.'],
										['Our Services evolve constantly. As such, the Services may change from time to time, at our discretion. We may stop (permanently or temporarily) providing the Services or any features within the Services to you or to users generally. We also retain the right to create limits on use and storage at our sole discretion at any time. We may also remove or refuse to distribute any Content on the Services, suspend or terminate users, and reclaim usernames without liability to you.'],
										['In consideration for eVectr granting you access to and use of the Services, you agree that eVectr and its third-party providers and partners may place advertising on the Services or in connection with the display of Content or information from the Services whether submitted by you or others. You also agree not to misuse our Services, for example, by interfering with them or accessing them using a method other than the interface and the instructions that we provide. You may not do any of the following while accessing or using the Services:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['access, tamper with, or use non-public areas of the Services, eVectr’s computer systems, or the technical delivery systems of eVectr’s providers;'],
											['probe, scan, or test the vulnerability of any system or network or breach or circumvent any security or authentication measures;'],
											['access or search or attempt to access or search the Services by any means (automated or otherwise) other than through our currently available, published interfaces that are provided by eVectr (and only pursuant to the applicable terms and conditions), unless you have been specifically allowed to do so in a separate agreement with eVectr (NOTE: crawling the Services is permissible if done in accordance with the provisions of the robots.txt file, however, scraping the Services without the prior consent of eVectr is expressly prohibited);'],
											['forge any TCP/IP packet header or any part of the header information in any email or posting, or in any way use the Services to send altered, deceptive or false source-identifying information; or'],
											['interfere with, or disrupt, (or attempt to do so), the access of any user, host or network, including, without limitation, sending a virus, overloading, flooding, spamming, mail-bombing the Services, or by scripting the creation of Content in such a manner as to interfere with or create an undue burden on the Services.'],
										]	}, 
									]
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['We also reserve the right to access, read, preserve, and disclose any information as we reasonably believe is necessary to:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['satisfy any applicable law, regulation, legal process or governmental request;'],
											['enforce the Terms, including investigation of potential violations hereof;'],
											['detect, prevent, or otherwise address fraud, security or technical issues'],
											['respond to user support requests; or'],
											['protect the rights, property or safety of eVectr, its users and the public. eVectr does not disclose personally-identifying information to third parties except in accordance with our Privacy Policy.'],
										]	}, 
									],
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'eligibility',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Eligibility' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['You must be at least 13 years to create an account with eVectr and utilize the basic services afforded on said account. However, should you seek to purchase, offer services or do both then you must be at least 18 years of age or have the consent of a legal parent or guardian with accompanying affidavits and/or documentations proving as such. By creating an account and utilizing the services, you represent and warrant that:'],
									]
								}, {
									tag:	'ul', 	props: {}, items: 	[
										{ tag: 'li', props: {}, xerox: true, items: [
											['you can form a binding contract with eVectr;'],
											['you are not a person who is barred from using the Service under the laws of the United States or any other applicable jurisdiction–meaning that you do not appear on the U.S. Treasury Department’s list of Specially Designated Nationals or face any other similar prohibition;'],
											['you will comply with this Agreement and all applicable local, state, national and international laws, rules and regulations; and'],
											['you have never been convicted of or pled no contest to a felony, to any crime involving, sex, fraud, theft, robbery, violence, and that you are not required to register as a sex offender with any state, federal or local sex offender registry.'],
										]	}, 
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'privacy-policy',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Privacy Policy' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['Our Privacy Policy (https://evectr.com/privacy) describes how we handle the information you provide to us when you use our Services. You understand that through your use of the Services you consent to the collection and use (as set forth in the Privacy Policy) of this information, including the transfer of this information to the United States, Ireland, and/or other countries for storage, processing and use by eVectr and its affiliates.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'account-terms',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Account' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['You may need to create an account to use some of our Services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.'],
									['You can control most communications from the Services. We may need to provide you with certain communications, such as service announcements and administrative messages. These communications are considered part of the Services and your account, and you may not be able to opt-out from receiving them. If you added your phone number to your account and you later change or deactivate that phone number, you must update your account information to help prevent us from communicating with anyone who acquires your old number.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'license',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'LICENSE TO USE SERVICES' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you as part of the Services. This license has the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by eVectr, in the manner permitted by these Terms.'],
									['The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries. Nothing in the Terms gives you a right to use the eVectr name or any of the eVectr trademarks, logos, domain names, and other distinctive brand features. All right, title, and interest in and to the Services (excluding Content provided by users) are and will remain the exclusive property of eVectr and its licensors. Any feedback, comments, or suggestions you may provide regarding eVectr, or the Services is entirely voluntary and we will be free to use such feedback, comments or suggestions as we see fit and without any obligation to you.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'user-inputs',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'User Profile and Information Inputs' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['You can choose between three profile options basic profile, basic profile with the option of purchasing services from other users and a profile with option to purchase services as well as offer services yourself to other users. It is important to remember that eVectr functions on the concept in which users with varied skills as well as distinct personal and social characteristics, then input (mandatory and optional) this information to create their profiles. Please refer to the below for which input belongs to what category:'],
									]
								}, {
									tag:	blk, props: {
										name:	'inputs-mandatory', 
										header: { fixed: true, small: true, label: 'Mandatory' },
										items:	[{ tag:	'ul', 	props: {}, items: 	[
											{ tag: 'li', props: {}, xerox: true, items: [
												['Country'],
												['Province / State'],
												['City'],
												['Languages'],
												['Hobbies and Interests'],
											]	}, 
										]	}]
									}
								}, {
									tag:	blk, props: {
										name:	'inputs-optional', 
										header: { fixed: true, small: true, label: 'Optional' },
										items:	[
											{ tag:	'ul', 	props: {}, items: 	[
													{ tag: 'li', props: {}, xerox: true, items: [
														['Nationality'],
														['Religion'],
														['Sex / Gender'],
														['Marital Status'],
													]	}, 
											]	}, {
												tag:	'p', props:	{ className: 'text' }, 
												xerox: true, items: [
													['These same inputs then function as the basis of eVectr’s search algorithm that allows users to network with other users with similar characteristics and or to identify users with specific skill sets. As such, eVectr’s functions primarily on what you as the user inputs in your profile with the additional understanding that ALL PROFILES ARE VIEWABLE EVECTR USERS. The reason being is to develop a searchable pool of users’ profiles narrowed by their respective inputs; essentially a database. This means possibly any user can search within a location (country, province/state, city) and find results for a specific input and those profiles with said input.'],
													['We at eVectr do recognize that despite the benefits of how our platform is designed, there exists the potential for misuse. Specifically, with respect to having a database of semi-sensitive inputs such as Nationality, Marital Status and more so with Religion. With that said we have tried to mitigate these concerns by offering you the choice of leaving any optional input field blank or for the completionist in mind to add the information, but control whether each of the inputs are publicly viewable. However, YOU ARE SOLELY RESPONSIBLE FOR ALL THE INFORMATION YOU INPUT AND WHAT DETAILS ARE MADE PUBLICLY VIEWABLE TO OTHER USERS. Disabling/Enabling the information of your choosing on your profiles requires you navigate to Settings and toggle Visibility Buttons for each of your corresponding inputs.'],
													['AS A REMINDER, IF YOU CHOOSE TO INPUT YOUR NATIONALITY, MARITAL STATUS OR RELIGION, YOU DO SO AT YOUR OWN DISCRETION AND YOU THEREBY AGREE THAT EVECTR WILL NOT BE LIABLE FOR ANY NEGATIVE REPRUSSIONS THAT MAY RESULT.'],
												],
											}, 
										],
									}
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'payments',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Purchasing Services and Payments' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['Prices will be as quoted on the Website or the App and will have applicable sales taxes at checkout. You will be charged at the time of placing your Order. Payment for Orders will be transacted through our applicable third-party payment processor. You consent to the collection and use of your information (including, if applicable, personal information) by such payment processing service as necessary to process your payments. We reserve the right to change, or to stop accepting, any permitted payment method at any time in our sole discretion. You agree we may charge your payment card for any order placed and for any additional amounts (including any taxes) as may be applicable in connection with your purchase. You are responsible to ensure that all of your billing information is current, complete, and accurate. We will provide you with an online and/or emailed billing summary statement which you may review, save, or print at your discretion. This is the only billing statement that will be provided by us.'],
									['The eVectr website and application serves as the intermediary between you and other users. The term other users mentioned above refers to service providers; meaning they have chosen to create a profile for the purpose of highlighting and providing their particular service to those seeking it. eVectr, has no direct affiliation with users’ classifying themselves as service provider and are NOT EMPLOYEES. As a result, prices are set exclusively at the discretion of the service provider; this includes any sales taxes and other applicable surcharges which can differentiate between regions, states/provinces and countries. One definitive surcharge on all purchases on the eVectr platform is our transaction fee. Onus is on the service provider to both include and inform you as their potential customer of any of these surcharges and sales taxes on the price they quote. Said, prices will be quoted on either the eVectr Website or Application; via their respective profile page.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'survey',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'User Surveys' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr employs the use of surveys; the content and results are used to in either calculating or have specific functionalities related to service provider’s security badges, ratings and sales benchmark system (please see Frequently Asked Question for elaboration on each). The surveys are bi-directional; meaning both service seeker and service providers are required to complete one after a transaction. Users may initially opt out of performing the surveys, but a reminder will be sent via users’ messages to ensure the completion.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'security-badges',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Users/Service Provider Security Badges' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['The eVectr security badges are earned when a user uploads three current photos that clearly identify what they look like in addition to uploading either a certified photo ID or provide corroborating links from another social networking platform (i.e. Facebook, LinkedIn, Instagram) that serves to verify their name and identity. Alternatively, users that enable their status as service providers can earn a badge by uploading qualification documents such as accreditation, licenses, background checks, bondability material, etc. Regardless, of what documentation a user chooses to upload, redacting or removing any sensitive personal details (i.e., address, phone number, emails, etc.) prior to uploading is sole responsibility of said user.'],
									['EVECTR WILL NOT BE LIABLE FOR ANY NEGATIVE REPRUCUSSIONS ATTRIBUTED TO UPLOADED MATERIAL, THAT IS RELEASED TO PUBLIC ACCIDENTALLY AS A RESULT OF A USER’S FAILURE TO FOLLOW THE NECESSARY PROTOCOL TO REDACT AND VERIFY PRIOR TO THE UPLOADING. EVECTR HAS PROVIDED ALL USERS ACCESS TO DELETE ANY DOCUMENTS THEY HAVE UPLOAEDED AND IT’S THE DUTY OF SAID USER TO DO SO IF SUCH SENSITIVE INFORMATION IS RELEASED.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'uploads',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'User Corroborative Uploaded Material' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['All corroborative material that any eVectr user chooses to upload must be verifiable. In instances where another user makes complaint or requests a profile audit, the eVectr User Satisfaction Team may ask for verifiable proof the documents uploaded is legitimate. Failure to do so may result in corrective actions; such as the eVectr team requesting that said documents be removed immediately. Should an incident occur where the eVectr team encounters a failure to comply or if there was an egregious effort made to mislead or misinform others on the platform, we reserve the right to suspend or ban the user completely.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'interaction',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'User-to-User Interaction Code of Conduct' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['eVectr users are bounded by standard code of conduct when interacting with one another; both online and if they choose meet in real life (i.e. service seekers meeting a service provider). Regardless of the interaction method, the expectation is that user’s avoid communication or taking action that is deemed to be:'],
										['harmful, threatening, abusive, harassing, tortuous, defamatory, vulgar, obscene, pornographic, libelous, invasive of another\'s privacy, hateful, or racially or ethnically objectionable, encouraging criminal behavior, giving rise to civil liability, leading to physical violence, violating any law, or is otherwise objectionable;'],
										['Specifically, for those who choose to interact in the real world, which include user to user interaction as well as service seeker to service provider and vice versa, adherence to the above restrictions must be accepted as well as the following:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['Avoid Using Inappropriate and Abusive Language.'],
											['Absolutely No Unwanted Physical Contact.'],
											['Avoid Continued Unwanted Contact or Communication (i.e. messaging, calling or any other direct contact deem uncomfortable by recipient.'],
										]	}, 
									]
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['Any user choosing to otherwise disregard this standard and continues communicating or taking actions in this manner risks punitive actions mentioned in the section below (see section for Punitive Action).'],
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'standards',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'User Conduct Standards & Violations' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr views on customer satisfaction based upon general standards amongst industry of any service type. These general standards include, being friendly, providing a good service and ensuring customer satisfaction. These are the benchmarks in which we expect all users with service provider status to employ; that and the expectation that a service provider will comply by User to User Interaction Standard Code of Conduct mentioned in the previous section.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'blocking',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Blocking Other Users' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr has provided all the users the necessary control on their profile to block another user. This could in the form of initial contact message received from said users (option to accept or block the user) or after interaction have occurred and the recipient deems the contact to not preferential (select the contact within a user’s community list and choose and accept the block option). However, we do encourage that you report any major violations that result in the person being blocked. This way we have a record of such violations as well if the offense is severe enough, we would want to investigate to ensure the safety and well-being of any other users the person may be interacting with.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'punitive-actions',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Punitive Actions' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['eVectr takes violations of standards and conduct very seriously and those users intending to partake in such activity are vulnerable to our punitive actions. All punitive measures performed by the eVectr team include and are limited to:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['Publicly signifying to other users of an offense, but we may choose to not go into the specifics (eVectr will not release public details on specific users’ violation unless it’s in the public interest) as a deterrence.'],
											['Rescind specified security badges (security and credentials shield on user Profile page).'],
											['Suspension or Revoking user’s status and disabling for a time their ability to enable transactions or service provider status until corrective action is taken.'],
											['Disabling the user’s status completely ensuring particular user has no access to enable transactions or be a service provider.'],
											['Deletion of the account users’ profile or take legal action where it is warranted.'],
										]	}, 
									]
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['The degree of violation will determine which punitive measure used; for relatively small offenses the first or second measure may be employed, whereas something more serious will justify the use of the remaining three measures.'],
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'reporting',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Request a Profile Audit or Reporting a Violation' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr offers all its users the right to either Request Profile Audit in, which a member of the eVectr Satisfaction Team attempts to contact the profile owner and validate the documents he or she has uploaded or Report a Violation, which serves as means for user to make complaint of another user. Both are avenues to report suspicious activities; such as uploaded corroborative documents that are either false or misleading, and in cases where a transaction has taken place, reporting of unsatisfactory services and behaviors that are deemed as harassment, illegal and immoral by either party; the service user or the service provider. Once such a complaint has been made the eVectr team will investigate to assess the validity of the complaint and determine the best course of action moving forward. If the complaint is warranted the above-mentioned punitive actions may be applied to the user in question. For any service user/service provider these options are available via the surveys requested after completion of a transaction. However, any eVectr users is given the ability to initiate the same actions as those mentioned above without the need of a survey by simply navigating to the Contact Us section to report suspicious activity. The eVectr team encourages all of its users to report such activities regardless if a transaction has occurred. This means anyone with suspicious material on their profile whether they standard user or service provider.'],
									['REGARDLESS, OF WHICH METHODOLOGY A USER CHOOSES TO REPORT A VIOLATION OR CALL FOR EVECTR TO PERFORM A PROFILE AUDIT, THE USER MAKING THE REQUEST WILL REMAIN ANONYMOUS. ANONMITY WILL ENSURE EYES WILL REMAIN ON ANY PARTY WHO COULD POTENTIALLY HARM OR MISLEAD THOSE IN THE EVECT COMMUNITY.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'services-incurred',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Services Incurred' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['All service-based commerce performed on the eVectr platform must be done in good faith by both the user and the service provider. This means that both users will adhere to conduct standards mentioned above as well as the terms of the transaction agreed by the two parties. Proven violations of either of these will be considered unacceptable. For example, if both parties agree that payment will be made after a service is performed. The expectation is that after the service provider performs said service he or she will be paid. Alternatively, if the two parties agreed the payment of service must be completed prior to the service being performed. The expectation is that the service be performed as agreed. If either party egregiously violates the understanding of good faith, eVectr may choose to employ our more extreme punitive measures (revoking status, suspension or banning) mentioned in sections above (see Punitive Actions).'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'pricing-refunds',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Service Pricing and Refunds' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['In the section above titled Purchasing Service and Payment, we emphasized the fact that Service Providers are not employees of eVectr, but rather self-employed individuals utilizing platform to advertise and sell the services they offer. As a result, they have full discretion on pricing. This is similarly, true for refunds. As such, prior to purchasing any services, it is your responsibility to determine what each service providers refund policy is and decide accordingly on proceeding with any transactions.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'processing',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Processing Orders' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['Once you submit an Order and your payment has been authorized (cash, credit card, or debit card), your Order will be transmitted to the restaurant you ordered from. Once you have submitted your Order and your payment has been authorized, you WILL NOT be entitled to change your order and you WILL NOT be entitled to a refund (except where prohibited by law). You are responsible to ensure that all of your restaurant order details, billing, delivery address, and other relevant personal information is current, complete, and accurate. Please note that any confirmation page that you may see on the Website and any Order confirmation email that you may receive each merely indicate that your Order has been received and is being processed by us, and does not necessarily mean that your Order has been accepted by the restaurant. We encourage all our restaurants to accept all Orders and to communicate any rejection promptly, and we will notify you (generally by email) as soon as reasonably practicable if a restaurant rejects your Order. However, restaurants have the discretion to reject Orders at any time because they are too busy, due to weather conditions or for any other reason.'],
									['Rejected Orders: Because of standard banking procedures, once you have submitted an Order that you are paying for by credit or debit card and your payment has been authorised, your bank or card issuer will "ring-fence" the full amount of your Order. If your Order is subsequently rejected by the restaurant or cancelled for any other reason, your bank or card issuer will not transfer the funds for the Order to us, and will instead release the relevant amount back into your available balance. However, this may take a period of typically up to 5 working days (and in some cases up to 30 days, depending on your bank or card issuer). You acknowledge and agree that neither the SKIP Group nor the relevant restaurant will be responsible or liable to you in relation to this delay by your bank or card issuer in the release of funds back into your account.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'taxes',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Service Provider\'s Registration as a Business & Taxes' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['For any user that has choosing to be a service provider. You are responsible for registering as a business and all the subsequent documentations required by law of your country. Similarly, the responsibility of determining the business type is up to you. Please make sure you research and understand the type of business you will be designating yourself as service provider on the eVectr platform. For example, if you choose to register your business as a sole proprietorship or a corporation, make sure you understand what that means in terms of liability. As mentioned in The Services sections above, service providers are considered third party providers and are not the employee of eVectr. Therefore, each service provider is themselves a self-owned business entity and eVectr is simply a gateway to their respective customer base. Thus, designation, registration and payment of applicable taxes per state/province and country are the sole responsibility of the service providers.'],
									['AS A REMINDER, EVECTR ROLE IS SOLELY THAT OF AN INTERMEDIARY BETWEEN YOU AS THE SERVICE PROVIDER AND OTHER USERS. YOU ARE THEREFORE RESPONSIBLE FOR REGISTERING AND DETERMINING THE TYPE OF BUSINESS ENTITY YOU WISH TO CREATE AND ALL SUBSEQUENT RESPONSIBILITY INCURRED FROM THAT BUSINESS DESIGNATION.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'content-terms',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Content' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['All information, data, text, software, music, sound, photographs, graphics, video, messages or other materials, whether publicly posted or privately transmitted to the Website or App or through the Service by viewers or users (“User Content”), is the sole responsibility of such viewers or users. This means that the viewer or user, and not any member of the SKIP Group, are entirely responsible for all such material uploaded, posted, emailed, transmitted or otherwise made available by using the Service. No member of the SKIP Group controls or actively monitors User Content and, as such, does not guarantee the accuracy, integrity or quality of such content. Users acknowledge that by using the Service, they may be exposed to materials that are offensive, indecent or objectionable. Under no circumstances will any member of the SKIP Group be liable in any way for any materials, including, but not limited to, for any errors or omissions in any materials or any defects or errors in any printing or manufacturing, or for any loss or damage of any kind incurred as a result of the viewing or use of any materials posted, emailed, transmitted or otherwise made available via the Service.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'advertisement',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Advertisement' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['eVectr employs targeted advertising based upon the inputs you provide when creating and populating the details within your profile. These inputs represent potential segment of the market that our third-party vendors can than used to advertise their products to. This is a necessary aspect of our business model and cannot be disabled. As previously stated in our Privacy policy, we will never release input details of a user to any third-party. However, we may choose to release aggregate input statistics of an entire group of users (i.e. percentage a user’s in a specific city who like to cook).'],
									['eVectr will not have Ads that lean towards any politically affiliation or persuasion (left or right). The reason being, that this platform was conceived as both social networking and e-commerce application. We consider the e-commerce aspect our platform equally definable and probably more so than the social networking aspect. With the current divisive political climate, we see the addition of politics as a deterrence to the interaction and commerce we are attempting to foster. This however, does not mean that we have any intention of censoring any users’ political opinion; rather it’s a corporation stance on the type of Ads we will be comfortable directing towards our users. All users are free to express their political opinion through discussion with other users; just so long as how they go about it does not violate our code of conduct and any other aspect highlighted in our terms and conditions.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'verification-material',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Verification Material' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['You are solely responsible for any verification materials posted via the services (if say you have chosen to become a service provider). This means redacting, removing and otherwise hiding sensitive personal information for any content used to verify your identity or otherwise supporting claims, skills and service inputs is entirely at your own discretion. All verification material is content and subject to the same governing principles as those above in the content terms above.'],
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'rights-grants',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Rights eVectr Grants to You' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['You retain your rights to any Content you submit, post or display on or through the Services. What’s yours is yours — you own your Content (and your incorporated audio, photos and videos are considered part of the Content).'],
									['By submitting, posting or displaying Content on or through the Services, you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such Content in any and all media or distribution methods (now known or later developed). This license authorizes us to make your Content available to the rest of the world and to let others do the same. You agree that this license includes the right for eVectr to provide, promote, and improve the Services and to make Content submitted to or through the Services available to other companies, organizations or individuals for the syndication, broadcast, distribution, promotion or publication of such Content on other media and services, subject to our terms and conditions for such Content use. Such additional uses by eVectr, or other companies, organizations or individuals, may be made with no compensation paid to you with respect to the Content that you submit, post, transmit or otherwise make available through the Services.'],
									['eVectr has an evolving set of rules for how ecosystem partners can interact with your Content on the Services. These rules exist to enable an open ecosystem with your rights in mind. You understand that we may modify or adapt your Content as it is distributed, syndicated, published, or broadcast by us and our partners and/or make changes to your Content in order to adapt the Content to different media.'],
									['You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions, power and/or authority necessary to grant the rights granted herein for any Content that you submit, post or display on or through the Services. You agree that such Content will not contain material subject to copyright or other proprietary rights, unless you have necessary permission or are otherwise legally entitled to post the material and to grant eVectr the license described above.'],
								],
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'restrictions',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Restrictions on User Content and Use of the Service' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['eVectr reserves the right at all times (but will have no obligation) to remove or refuse to distribute any User Content and to terminate users or reclaim usernames. We also reserve the right to access, read, preserve, and disclose any information as we reasonably believe is necessary to:'],
									],
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['satisfy any applicable law, regulation, legal process or governmental request;'],
											['enforce this Agreement, including investigation of potential violations hereof;'],
											['detect, prevent, or otherwise address fraud, security or technical issues; and'],
											['respond to user support requests, or v. protect the rights, property or safety of our users and the public.'],
										]	}, 
									],
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['In using the Website, App or Service you will not:'],
									],
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: {}, xerox: true, items: [
											['copy any content unless expressly permitted to do so herein; and'],
											['upload, post, email, transmit or otherwise make available any material that:', {
												tag:	'ol', 	props: {}, items: 	[
													{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
														['is unlawful, harmful, threatening, abusive, harassing, tortuous, defamatory, vulgar, obscene, pornographic, libelous, invasive of another\'s privacy, hateful, or racially or ethnically objectionable, encourages criminal behavior, gives rise to civil liability, violates any law, or is otherwise objectionable;'],
														['You do not have a right to make available under any law or under a contractual relationship;'],
														['infringes any patent, trademark, trade secret, copyright or other proprietary rights of any party (including privacy rights);'],
														['is or contains unsolicited or unauthorized advertising, solicitations for business, promotional materials, "junk mail," "spam," "chain letters," "pyramid schemes," or any other form of solicitation;'],
														['contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment or data or the Website or that of any users or viewers of the Website or that compromises a user’s privacy;'],
														['contains any falsehoods or misrepresentations or create an impression that You know is incorrect, misleading, or deceptive, or any material that could damage or harm minors in any way;'],
														['impersonate any person or entity or misrepresent their affiliation with a person or entity;'],
														['forge headers or otherwise manipulate identifiers in order to disguise the origin of any material transmitted to or through the Website or impersonate another person or organization;'],
														['interfere with or disrupt the Website or servers or networks connected to the Website, or disobey any requirements, procedures, policies or regulations of networks connected to the Website or probe, scan, or test the vulnerability of any system or network or breach or circumvent any security or authentication measures;'],
														['intentionally or unintentionally violate any applicable local, state, national or international law or regulation;'],
														['collect or store personal information about other users or viewers;'],
														['license, sell, rent, lease, transfer, assign, distribute, host, or otherwise commercially exploit the Website or App; or'],
														['modify, translate, make derivative works of, disassemble, decompile, reverse compile or reverse engineer any part of the App or any software provided as part of the Website, except to the extent the foregoing restrictions are expressly prohibited by applicable law.'],
														['You also agree not to access the Website or App in a manner that utilizes the resources of the Website or App more heavily than would be the case for an individual person using a conventional web browser. Notwithstanding the foregoing, operators of public search engines may use spiders or other bots for the purpose of creating publicly available searchable indices of the materials on this Website.'],
													]	}, 
												]
											}	] 
										]	}, 
									],
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'safety',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Safety and Interactions with Other Users' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['Though eVectr strives to encourage a respectful user experience through features like the double opt-in that only allows users to communicate if they have both indicated interest in one another, it is not responsible for the conduct of any user on or off of the Service. You agree to use caution in all interactions with other users, particularly if you decide to communicate off the Service or meet in person. In addition, you agree to review and follow eVectr’s Safety Tips prior to using the Service. You agree that you will not provide your financial information (for example, your credit card or bank account information), or wire or otherwise send money, to other users.'],
									['YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS. YOU UNDERSTAND THAT EVECTR DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON ITS USERS OR OTHERWISE INQUIRE INTO THE BACKGROUND OF ITS USERS. EVECTR MAKES NO REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF USERS. EVECTR RESERVES THE RIGHT TO CONDUCT – AND YOU AGREE THAT EVECTR MAY CONDUCT - ANY CRIMINAL BACKGROUND CHECK OR OTHER SCREENINGS (SUCH AS SEX OFFENDER REGISTER SEARCHES) AT ANY TIME USING AVAILABLE PUBLIC RECORDS.'],
									['IF YOU CHOOSE TO MEET OTHER USERS AND OR SERVICE PROVIDER AND EMPLOY THEIR SERVICES, SUCH INTERACTIONS WILL BE DONE UNDER YOUR OWN PRIVY AND PERSONAL DISCRETION. THUS, YOU AGREE THAT EVECTR WILL NOT BE LIABLE OF ANY NEGATIVE REPRUSSIONS RESULTING FROM DIRECT INTERACTIONS BETWEEN YOU AND OTHER USERS.'],
								]
							}]
						}
					}, {
						tag: pnl, props: { 
							name:	'ending-terms',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Ending the Terms' },
							body:	[
								{
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['You may end your legal agreement with eVectr at any time by deactivating your accounts and discontinuing your use of the Services. See http://evectr.com/help for instructions on how to deactivate your account and the Privacy Policy for more information on what happens to your information.'],
										['We may suspend or terminate your account or cease providing you with all or part of the Services at any time for any or no reason, including, but not limited to, if we reasonably believe:'],
									]
								}, {
									tag:	'ol', 	props: {}, items: 	[
										{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
											['you have violated these Terms or the eVectr;'],
											['you create risk or possible legal exposure for us;'],
											['your account should be removed due to prolonged inactivity; or'],
											['our provision of the Services to you is no longer commercially viable. We will make reasonable efforts to notify you by the email address associated with your account or the next time you attempt to access your account, depending on the circumstances.'],
										]	}, 
									]
								}, {
									tag:	'p', props:	{ className: 'text' }, 
									xerox: true, items: [
										['In all such cases, the Terms shall terminate, including, without limitation, your license to use the Services, except that the following sections shall continue to apply: II, III, V, and VI.'],
									]
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'disclaimers',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'Disclaimers and Limitations of Liability' },
							body:	[
								{
									tag:	blk, props: {
										name:	'services-as-is', 
										header: { fixed: true, small: true, label: 'The Services are Available "AS-IS"' },
										items:	[
											{
												tag:	'p', props:	{ className: 'text' }, 
												xerox: true, items: [
													['Your access to and use of the Services or any Content are at your own risk. You understand and agree that the Services are provided to you on an “AS IS” and “AS AVAILABLE” basis. The “eVectr Entities” refers to eVectr, its parents, affiliates, related companies, officers, directors, employees, agents, representatives, partners, and licensors. Without limiting the foregoing, to the maximum extent permitted under applicable law, THE EVECTR ENTITIES DISCLAIM ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS OR IMPLIED, OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. The eVectr Entities make no warranty or representation and disclaim all responsibility and liability for:'],
												]
											}, {
												tag:	'ol', 	props: {}, items: 	[
													{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
														['the completeness, accuracy, availability, timeliness, security or reliability of the Services or any Content;'],
														['any harm to your computer system, loss of data, or other harm that results from your access to or use of the Services or any Content;'],
														['the deletion of, or the failure to store or to transmit, any Content and other communications maintained by the Services; and'],
														['whether the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis.'],
													]	}, 
												]
											}, {
												tag:	'p', props:	{ className: 'text' }, 
												xerox: true, items: [
													['No advice or information, whether oral or written, obtained from the eVectr Entities or through the Services, will create any warranty or representation not expressly made herein.'],
												]
											}, 
										]
									}
								}, {
									tag:	blk, props: {
										name:	'liability', 
										header: { fixed: true, small: true, label: 'Limitation of Liability' },
										items:	[
											{
												tag:	'p', props:	{ className: 'text' }, 
												xerox: true, items: [
													['TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE EVECTR ENTITIES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:'],
												]
											}, {
												tag:	'ol', 	props: {}, items: 	[
													{ tag: 'li', props: { style: { listStyleType:'lower-roman' },  }, xerox: true, items: [
														['YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES;'],
														['ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES, INCLUDING WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE OR ILLEGAL CONDUCT OF OTHER USERS OR THIRD PARTIES;'],
														['ANY CONTENT OBTAINED FROM THE SERVICES; OR'],
														['UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.'],
													]	}, 
												]
											}, {
												tag:	'p', props:	{ className: 'text' }, 
												xerox: true, items: [
													['IN NO EVENT SHALL THE AGGREGATE LIABILITY OF THE EVECTR ENTITIES EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS (U.S. $100.00) OR THE AMOUNT YOU PAID TWITTER, IF ANY, IN THE PAST SIX MONTHS FOR THE SERVICES GIVING RISE TO THE CLAIM. THE LIMITATIONS OF THIS SUBSECTION SHALL APPLY TO ANY THEORY OF LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, AND WHETHER OR NOT THE EVECTR ENTITIES HAVE BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.'],
												]
											}, 
										]
									}
								}, 
							]
						}
					}, {
						tag: pnl, props: { 
							name:	'general',
							align: 	'legal',
							header: { fixed: true, small: true, label: 'General' },
							body:	[{
								tag:	'p', props:	{ className: 'text' }, 
								xerox: true, items: [
									['We may revise these Terms from time to time. The changes will not be retroactive, and the most current version of the Terms, which will always be at evectr.com/terms, will govern our relationship with you. We will try to notify you of material revisions, for example via a service notification or an email to the email associated with your account. By continuing to access or use the Services after those revisions become effective, you agree to be bound by the revised Terms.'],
									['The laws of the State of California, excluding its choice of law provisions, will govern these Terms and any dispute that arises between you and eVectr. All disputes related to these Terms or the Services will be brought solely in the federal or state courts located in San Francisco County, California, United States, and you consent to personal jurisdiction and waive any objection as to inconvenient forum.'],
									['If you are a federal, state, or local government entity in the United States using the Services in your official capacity and legally unable to accept the controlling law, jurisdiction or venue clauses above, then those clauses do not apply to you. For such U.S. federal government entities, these Terms and any action related thereto will be governed by the laws of the United States of America (without reference to conflict of laws) and, in the absence of federal law and to the extent permitted under federal law, the laws of the State of California (excluding choice of law).'],
									['In the event that any provision of these Terms is held to be invalid or unenforceable, then that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions of these Terms will remain in full force and effect. eVectr’s failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.'],
									[
										'These Terms are an agreement between you and ',
										{ tag: { from: 'Stock',  name: ['Address'] }, props: Assign({},cnt.Address, {flat:true}) },
										'. If you have any questions about these Terms, please contact us.'
									],
									['Effective: ', { tag: 'time', props: { dateTime: '2018-07-07T' }, items: ['May 25, 2019'] }],
								]
							}]
						}
					}
				]; break;;
			}
			return res;	 
		},
	],
	Build: function (Actions, Stores) {
		return function (res) {
			// -----
			return Stores.App.singleton.updateStore({
				page: 		{ num: 1, pth: [''] },
				content: 	{
					built: 		true,
					nav: 		{},
					segments: 	{
						sidebar: 	res.sidebar,
						copy: 		res.copy,
						other:		res.other,
					}
				},
			}, true);
		}
	}
}

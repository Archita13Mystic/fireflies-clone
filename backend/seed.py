import json
from datetime import datetime, timedelta
from database import engine, Base, SessionLocal
import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if database is already seeded
    if db.query(models.Meeting).first():
        print("Database already contains data. Skipping seed.")
        db.close()
        return

    print("Seeding database with 5 specified meetings...")

    now = datetime.utcnow()

    # Define common helper to generate timestamps
    # gaps of 8-40 seconds
    def gen_timestamps(count, start=0.0):
        times = []
        curr = start
        import random
        random.seed(42)  # Deterministic seed data
        for _ in range(count):
            gap = random.randint(12, 35)
            times.append((curr, curr + gap))
            curr += gap + random.randint(2, 8)
        return times

    # ----------------------------------------------------
    # Meeting 1: "Q3 Product Roadmap Review"
    # Date: 22 days ago, Duration: 52 min (3120 sec)
    # Participants: ["Sarah Chen", "Marcus Webb", "Priya Nair", "Tom Okoro"]
    # Action items: 4 items (2 completed, 2 open)
    # ----------------------------------------------------
    m1 = models.Meeting(
        title="Q3 Product Roadmap Review",
        date=now - timedelta(days=22),
        duration=3120,
        participants=json.dumps(["Sarah Chen", "Marcus Webb", "Priya Nair", "Tom Okoro"]),
        audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(m1)
    db.commit()
    db.refresh(m1)

    m1_dialogue = [
        ("Sarah Chen", "Welcome everyone to our Q3 Product Roadmap sync. We have a lot of items to get through today, specifically feature prioritization and our mobile app release."),
        ("Marcus Webb", "Thanks Sarah. On the engineering side, we've finished the initial architecture for the new API v2. It's looking clean, but we need to finalize the schema."),
        ("Priya Nair", "From design, we've updated the Figma prototypes for the mobile checkout flow. I want to walk you all through the checkout screens later in this call."),
        ("Tom Okoro", "That's great. From a product marketing standpoint, we need to finalize our OKRs for this quarter so we can start planning the beta launch campaigns."),
        ("Sarah Chen", "Perfect. Let's start with Feature Prioritization. Marcus, what are the primary blockers we're facing for the core API endpoints?"),
        ("Marcus Webb", "Mainly load testing. We want to make sure the database handles multiple concurrent transcription queries under load. We're using SQLite for caching, but the main read path needs validation."),
        ("Priya Nair", "If the API changes, will it impact the frontend components for the interactive transcript search? We want it to feel fast."),
        ("Marcus Webb", "No, the schema is backward compatible, so there should be no impact on your current components."),
        ("Tom Okoro", "Let's align on the Q3 OKRs. Our main key result is reaching 10,000 active beta users for the mobile app within the next two months."),
        ("Sarah Chen", "To support that, we need to launch the Mobile App Beta on TestFlight by the end of this month. Priya, is the design handoff ready?"),
        ("Priya Nair", "Yes, the handoff is complete. The engineers have access to all redlines and interactive prototypes in Figma."),
        ("Marcus Webb", "Excellent. I will assign the mobile frontend integration to Dev's team first thing tomorrow."),
        ("Sarah Chen", "What about the API v2 documentation? Customers have been asking for the webhook specifications."),
        ("Tom Okoro", "I can draft the API integration user guide if Marcus's team can provide the raw Swagger JSON."),
        ("Marcus Webb", "I'll export the Swagger specs and upload them to the repository by Friday afternoon."),
        ("Priya Nair", "I also suggest setting up a feedback widget directly inside the beta mobile app to capture bugs easily."),
        ("Sarah Chen", "Good idea. Let's make sure that's included in the beta launch scope. Tom, can you coordinate the widget setup?"),
        ("Tom Okoro", "Yes, I'll research the best widget SDKs and create a ticket for it."),
        ("Sarah Chen", "Let's move on to the outline for the beta launch. What are the key stages we need to track?"),
        ("Marcus Webb", "Stage one is internal QA, which starts next week. Stage two is the private developer beta, followed by the public TestFlight release."),
        ("Priya Nair", "For the design phase of stage two, I need to verify that our color system complies with Web Content Accessibility Guidelines."),
        ("Sarah Chen", "That is critical. Accessibility shouldn't be an afterthought. Let's make sure Priya audits the checkout screen colors."),
        ("Tom Okoro", "Agreed. We also need a landing page for registration. I'll write the copy for the signup page."),
        ("Sarah Chen", "Let's check our action items. Marcus, you have the Swagger export and the schema validation."),
        ("Marcus Webb", "I'll get on the Swagger export. The schema validation is already done and checked in."),
        ("Priya Nair", "And I will perform the accessibility review on the mobile checkouts by next Wednesday."),
        ("Tom Okoro", "I'll set up the feedback widget research and start drafting the OKR presentation slides."),
        ("Sarah Chen", "Awesome. Let's review the roadmap one last time. We are on track for all major milestones. Thanks everyone!"),
        ("Marcus Webb", "Thanks all. Let's keep up the momentum."),
        ("Tom Okoro", "Talk to you later. Bye!")
    ]

    m1_times = gen_timestamps(len(m1_dialogue), 5.0)
    for i, (sp, txt) in enumerate(m1_dialogue):
        db.add(models.Transcript(
            meeting_id=m1.id,
            speaker=sp,
            text=txt,
            start_time=m1_times[i][0],
            end_time=m1_times[i][1],
            sequence=i + 1
        ))

    db.add(models.Summary(
        meeting_id=m1.id,
        overview="The team aligned on the Q3 Product Roadmap, prioritizing features for the Mobile App beta launch and finishing API v2 schemas. They reviewed Figma prototypes and set accessibility guidelines.",
        key_topics=json.dumps(["Feature Prioritization", "Q3 OKRs", "Mobile App", "API v2", "Beta Launch"]),
        outline=json.dumps([
            {"title": "Welcome & Agenda", "start_time": 5.0},
            {"title": "API v2 & Feature Prioritization", "start_time": 45.0},
            {"title": "Mobile App Designs & Accessibility", "start_time": 300.0},
            {"title": "Beta Launch Outline & Action Items", "start_time": 600.0}
        ])
    ))

    m1_actions = [
        models.ActionItem(meeting_id=m1.id, text="Export API v2 Swagger specifications for marketing team review", assignee="Marcus Webb", due_date="2026-08-20", completed=False),
        models.ActionItem(meeting_id=m1.id, text="Review mobile app checkout screen design for accessibility compliance", assignee="Priya Nair", due_date="2026-08-19", completed=True),
        models.ActionItem(meeting_id=m1.id, text="Research in-app feedback widgets for beta user reporting", assignee="Tom Okoro", due_date="2026-08-22", completed=False),
        models.ActionItem(meeting_id=m1.id, text="Finalize Q3 OKRs and roadmap presentation slides", assignee="Sarah Chen", due_date="2026-08-15", completed=True)
    ]
    for action in m1_actions:
        db.add(action)


    # ----------------------------------------------------
    # Meeting 2: "Engineering Standup — Sprint 42"
    # Date: 5 days ago, Duration: 18 min (1080 sec)
    # Participants: ["Marcus Webb", "Lena Fischer", "Dev Kapoor"]
    # Action items: 3 items (1 completed)
    # ----------------------------------------------------
    m2 = models.Meeting(
        title="Engineering Standup — Sprint 42",
        date=now - timedelta(days=5),
        duration=1080,
        participants=json.dumps(["Marcus Webb", "Lena Fischer", "Dev Kapoor"]),
        audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(m2)
    db.commit()
    db.refresh(m2)

    m2_dialogue = [
        ("Marcus Webb", "Good morning. Let's start the standup for Sprint 42. Lena, do you want to go first?"),
        ("Lena Fischer", "Sure. Yesterday I worked on the CI pipeline configuration. I resolved the issue where tests were failing due to missing dependencies."),
        ("Dev Kapoor", "Great job Lena. Did you check if the container registry auto-deploys correctly on branch merge?"),
        ("Lena Fischer", "Yes, I verified that. It works. Today, I'll focus on code review for the authentication middleware."),
        ("Marcus Webb", "Any blockers on that, Lena?"),
        ("Lena Fischer", "No blockers, just waiting for Dev to review my pull request so we can merge it."),
        ("Dev Kapoor", "I'll do that right after this standup. As for me, yesterday I debugged the SQLite connection pool leaks."),
        ("Dev Kapoor", "It turns out we weren't closing sessions in the background task threads. I've refactored database.py to yield sessions properly."),
        ("Marcus Webb", "Excellent. That leak was causing high memory utilization. What is your plan for today?"),
        ("Dev Kapoor", "Today, I will begin implementing the full-text search router. I'll write some unit tests first to make sure edge cases are covered."),
        ("Marcus Webb", "Make sure the search endpoint handles multiple spaces and special characters safely."),
        ("Dev Kapoor", "Yes, I will add regex sanitization to the query parameters."),
        ("Marcus Webb", "As for my update, I spent yesterday coordinating the staging database migration. The migration scripts ran successfully."),
        ("Marcus Webb", "Today, I'll assist with testing the CI pipeline's automated rollback mechanism if the build fails."),
        ("Lena Fischer", "I can help you with the rollback validation since I have the configuration open."),
        ("Marcus Webb", "That would be very helpful, Lena. Let's pair on that after lunch."),
        ("Dev Kapoor", "I have a quick question. Do we need to update our staging secrets for the database connection?"),
        ("Marcus Webb", "No, the existing secrets are valid. Let's make sure we don't commit any credentials to the git history."),
        ("Lena Fischer", "Of course. The linting rules should block any committed secrets anyway."),
        ("Marcus Webb", "Awesome. Let's keep this sprint moving. Thanks everyone, have a productive day!"),
    ]

    m2_times = gen_timestamps(len(m2_dialogue), 3.0)
    for i, (sp, txt) in enumerate(m2_dialogue):
        db.add(models.Transcript(
            meeting_id=m2.id,
            speaker=sp,
            text=txt,
            start_time=m2_times[i][0],
            end_time=m2_times[i][1],
            sequence=i + 1
        ))

    db.add(models.Summary(
        meeting_id=m2.id,
        overview="The engineering team discussed sprint progress, resolving database connection pool leaks, configuring CI pipelines, and starting work on the code review and search features.",
        key_topics=json.dumps(["Sprint Progress", "Blockers", "CI Pipeline", "Code Review"]),
        outline=json.dumps([
            {"title": "Standup Intro & Lena's Update", "start_time": 3.0},
            {"title": "Dev's Database Leak Fix", "start_time": 200.0},
            {"title": "Marcus's Migration & Next Steps", "start_time": 450.0}
        ])
    ))

    m2_actions = [
        models.ActionItem(meeting_id=m2.id, text="Review Lena's pull request for the authentication middleware", assignee="Dev Kapoor", due_date="2026-08-15", completed=True),
        models.ActionItem(meeting_id=m2.id, text="Add database connection cleanup checks in the CI test suite", assignee="Lena Fischer", due_date="2026-08-16", completed=False),
        models.ActionItem(meeting_id=m2.id, text="Draft documentation for rollback procedures on failure", assignee="Marcus Webb", due_date="2026-08-18", completed=False)
    ]
    for action in m2_actions:
        db.add(action)


    # ----------------------------------------------------
    # Meeting 3: "Client Onboarding Call — Acme Corp"
    # Date: 14 days ago, Duration: 41 min (2460 sec)
    # Participants: ["Sarah Chen", "Tom Okoro", "Rachel Kim (Acme)", "James Park (Acme)"]
    # Action items: 5 items (3 completed)
    # ----------------------------------------------------
    m3 = models.Meeting(
        title="Client Onboarding Call — Acme Corp",
        date=now - timedelta(days=14),
        duration=2460,
        participants=json.dumps(["Sarah Chen", "Tom Okoro", "Rachel Kim (Acme)", "James Park (Acme)"]),
        audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(m3)
    db.commit()
    db.refresh(m3)

    m3_dialogue = [
        ("Sarah Chen", "Hi Rachel, James, thank you for joining the onboarding call. We want to align on the timeline and integration setup."),
        ("Rachel Kim (Acme)", "Thanks Sarah. We are excited to get started. Our main priority is connecting our CRM system with your transcript API."),
        ("Tom Okoro", "Welcome guys. Yes, we support automated push webhooks for all completed transcripts. It syncs directly with Salesforce and HubSpot."),
        ("James Park (Acme)", "That's great. What about the training and SLA support? We have a team of 50 agents who will be using the dashboard daily."),
        ("Sarah Chen", "We offer a dedicated slack channel and live onboarding sessions. Let's schedule those training sessions for next week."),
        ("Rachel Kim (Acme)", "Perfect. Can you walk us through the security parameters? How is customer data isolated?"),
        ("Tom Okoro", "All customer databases are logically isolated, and we use column-level encryption for personal information."),
        ("James Park (Acme)", "That meets our compliance requirements. Do you have a copy of your SOC2 report we can review?"),
        ("Sarah Chen", "Yes, I will email the SOC2 compliance audit report immediately after this call."),
        ("Rachel Kim (Acme)", "Excellent. What are the key success metrics we should track during this pilot phase?"),
        ("Tom Okoro", "We recommend tracking the transcript accuracy rate, search latency, and action item adoption rate among your team."),
        ("James Park (Acme)", "We also want to monitor API uptime. We require 99.9% uptime according to our SLA contract."),
        ("Sarah Chen", "Our SLA guarantees 99.9% uptime, and you can monitor our public status page at any time."),
        ("Rachel Kim (Acme)", "Great. Let's map out the onboarding milestones. When can we expect access to the staging environment?"),
        ("Tom Okoro", "I will configure your client credentials today and send the credentials sheet to James."),
        ("James Park (Acme)", "Perfect, I'll pass those to our developer team to begin testing webhook payloads."),
        ("Sarah Chen", "Awesome. Let's also set up the weekly check-in call to review the progress of the pilot."),
        ("Rachel Kim (Acme)", "A Tuesday afternoon check-in works best for our team. Let's set that up."),
        ("Tom Okoro", "I will send a calendar invite for Tuesdays at 2 PM starting next week."),
        ("Sarah Chen", "Let's summarize our immediate action items. I will send the SOC2 report and schedule the training session."),
        ("Tom Okoro", "I'll generate the staging API keys and send the webhook payload schema to James."),
        ("James Park (Acme)", "And I'll set up the endpoint receiver on our staging server to parse incoming webhooks."),
        ("Rachel Kim (Acme)", "I will share the user list with Sarah for account creation."),
        ("Sarah Chen", "This sounds like a solid plan. Welcome to Fireflies, and we look forward to a successful pilot!"),
        ("Rachel Kim (Acme)", "Thank you Sarah and Tom, speak next week."),
        ("James Park (Acme)", "Thanks everyone, goodbye!"),
        ("Tom Okoro", "Have a great day, bye!"),
        ("Sarah Chen", "Bye all!")
    ]

    m3_times = gen_timestamps(len(m3_dialogue), 6.0)
    for i, (sp, txt) in enumerate(m3_dialogue):
        db.add(models.Transcript(
            meeting_id=m3.id,
            speaker=sp,
            text=txt,
            start_time=m3_times[i][0],
            end_time=m3_times[i][1],
            sequence=i + 1
        ))

    db.add(models.Summary(
        meeting_id=m3.id,
        overview="Onboarding kickoff call with Acme Corp. The discussion outlined integration steps, training schedules, SOC2 reports, and pilot success metrics.",
        key_topics=json.dumps(["Onboarding Timeline", "Integration Setup", "Training", "Support SLA", "Success Metrics"]),
        outline=json.dumps([
            {"title": "Kickoff & Integration Goals", "start_time": 6.0},
            {"title": "Security & SOC2 Audit", "start_time": 250.0},
            {"title": "Success Metrics & Uptime SLA", "start_time": 600.0},
            {"title": "Milestones & Action Items", "start_time": 1000.0}
        ])
    ))

    m3_actions = [
        models.ActionItem(meeting_id=m3.id, text="Send SOC2 compliance report to Rachel and James", assignee="Sarah Chen", due_date="2026-08-15", completed=True),
        models.ActionItem(meeting_id=m3.id, text="Generate staging API credentials and client keys", assignee="Tom Okoro", due_date="2026-08-14", completed=True),
        models.ActionItem(meeting_id=m3.id, text="Share team user list for dashboard account creation", assignee="Rachel Kim (Acme)", due_date="2026-08-16", completed=True),
        models.ActionItem(meeting_id=m3.id, text="Set up webhook endpoint receiver on Acme test server", assignee="James Park (Acme)", due_date="2026-08-18", completed=False),
        models.ActionItem(meeting_id=m3.id, text="Send calendar invitation for weekly Tuesday check-ins", assignee="Tom Okoro", due_date="2026-08-15", completed=False)
    ]
    for action in m3_actions:
        db.add(action)


    # ----------------------------------------------------
    # Meeting 4: "Design Review: Mobile Checkout Flow"
    # Date: 8 days ago, Duration: 35 min (2100 sec)
    # Participants: ["Priya Nair", "Lena Fischer", "Marcus Webb"]
    # Action items: 3 items (0 completed)
    # ----------------------------------------------------
    m4 = models.Meeting(
        title="Design Review: Mobile Checkout Flow",
        date=now - timedelta(days=8),
        duration=2100,
        participants=json.dumps(["Priya Nair", "Lena Fischer", "Marcus Webb"]),
        audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(m4)
    db.commit()
    db.refresh(m4)

    m4_dialogue = [
        ("Priya Nair", "Welcome to the design review. Today we are looking at the mobile checkout flow prototypes. I want feedback on the UX patterns and payment screens."),
        ("Lena Fischer", "Thanks Priya. The payment flow looks very smooth. I noticed the button transition has a slight lag in the prototype. Is that intentional?"),
        ("Marcus Webb", "No, we should avoid transitions that delay user action. Let's make the button hover and loading states snappier."),
        ("Priya Nair", "Good catch. I will adjust the animation duration in the prototype from 500ms to 150ms."),
        ("Lena Fischer", "How are we handling payment errors? For example, if a credit card is declined, where is the error message positioned?"),
        ("Priya Nair", "The error message is displayed directly above the input fields, highlighted in red with an warning icon. It will auto-focus the field."),
        ("Marcus Webb", "Excellent, auto-focusing the invalid input is standard accessibility practice. Did we run an accessibility contrast test?"),
        ("Priya Nair", "Yes, all checkout texts pass AA standards, but the placeholder text color might need a higher contrast ratio."),
        ("Lena Fischer", "I agree, on low-brightness mobile screens, placeholder text can be hard to read. Let's make it slightly darker."),
        ("Marcus Webb", "Regarding payment methods, are we including Apple Pay and Google Pay in this initial mockup?"),
        ("Priya Nair", "Yes, they are placed right at the top of the payment screen for quick one-click transactions."),
        ("Marcus Webb", "Perfect, that will reduce transaction friction and boost conversion rates."),
        ("Lena Fischer", "When do we expect the design handoff to the engineering team?"),
        ("Priya Nair", "I'll make the contrast modifications today and hand it off by tomorrow morning."),
        ("Marcus Webb", "Awesome. I will review the handoff specs as soon as you upload them to Zeplin."),
        ("Lena Fischer", "I can start setting up the frontend components for the checkout form inputs next week."),
        ("Priya Nair", "I'll make sure to export all SVG icon assets directly into the handoff folder."),
        ("Marcus Webb", "Let's review the actions. Priya is doing contrast updates and asset exports. Lena is setting up components."),
        ("Lena Fischer", "Yes, I will create the form validation patterns as well."),
        ("Marcus Webb", "I will review the design handoff. Let's sync again once components are scaffolded."),
        ("Priya Nair", "Sounds like a plan. Thank you for the feedback, everyone!"),
        ("Marcus Webb", "Great job, Priya. Bye!"),
        ("Lena Fischer", "Thank you, bye!"),
        ("Priya Nair", "Bye!")
    ]

    m4_times = gen_timestamps(len(m4_dialogue), 4.0)
    for i, (sp, txt) in enumerate(m4_dialogue):
        db.add(models.Transcript(
            meeting_id=m4.id,
            speaker=sp,
            text=txt,
            start_time=m4_times[i][0],
            end_time=m4_times[i][1],
            sequence=i + 1
        ))

    db.add(models.Summary(
        meeting_id=m4.id,
        overview="Design critique session focused on the mobile checkout user flow. Key issues discussed were animation lag, error reporting, placeholder text contrast, and payment options integration.",
        key_topics=json.dumps(["UX Patterns", "Payment Flow", "Accessibility", "Prototype Feedback", "Handoff"]),
        outline=json.dumps([
            {"title": "Checkout Screen Walkthrough", "start_time": 4.0},
            {"title": "Accessibility & Error States Audit", "start_time": 180.0},
            {"title": "Handoff Schedule & Action Items", "start_time": 500.0}
        ])
    ))

    m4_actions = [
        models.ActionItem(meeting_id=m4.id, text="Adjust placeholder contrast and export SVG assets to Zeplin", assignee="Priya Nair", due_date="2026-08-15", completed=False),
        models.ActionItem(meeting_id=m4.id, text="Review Zeplin handoff assets and verify responsive layout guidelines", assignee="Marcus Webb", due_date="2026-08-16", completed=False),
        models.ActionItem(meeting_id=m4.id, text="Scaffold mobile checkout frontend form components and validations", assignee="Lena Fischer", due_date="2026-08-20", completed=False)
    ]
    for action in m4_actions:
        db.add(action)


    # ----------------------------------------------------
    # Meeting 5: "Investor Update — Series A Prep"
    # Date: 2 days ago, Duration: 28 min (1680 sec)
    # Participants: ["Sarah Chen", "Dev Kapoor", "Tom Okoro"]
    # Action items: 4 items (1 completed)
    # ----------------------------------------------------
    m5 = models.Meeting(
        title="Investor Update — Series A Prep",
        date=now - timedelta(days=2),
        duration=1680,
        participants=json.dumps(["Sarah Chen", "Dev Kapoor", "Tom Okoro"]),
        audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    )
    db.add(m5)
    db.commit()
    db.refresh(m5)

    m5_dialogue = [
        ("Sarah Chen", "Hi Dev, Tom, let's align on our Series A pitch deck. We need to make sure the metrics and traction narrative are extremely clear."),
        ("Tom Okoro", "Yes, I updated the traction slide with our latest monthly recurring revenue figures. We hit 120k MRR last month, representing 15% month-over-month growth."),
        ("Dev Kapoor", "Excellent growth metrics. On the technology side, I prepared the go-to-market architecture summary, showcasing how we scale transcription nodes."),
        ("Sarah Chen", "That will resonate well with technical investors. How are we handling competitive landscape questions?"),
        ("Tom Okoro", "I added a feature matrix comparing us directly to older legacy transcription tools. It highlights our speed and API integrations."),
        ("Sarah Chen", "Good. Make sure we emphasize our proprietary search parsing speed. That's a major competitive advantage."),
        ("Dev Kapoor", "I'll double check the backend latency figures so we don't present any unverified data."),
        ("Sarah Chen", "Yes, keep it realistic. What's our valuation target for this round?"),
        ("Tom Okoro", "We're aiming for a 25 million valuation, but we need to validate that against recent market comparables."),
        ("Sarah Chen", "I'll research valuation comparables tonight. Let's make sure the slides look premium and clean."),
        ("Dev Kapoor", "Do you need me to present the API usage statistics from our active customers?"),
        ("Sarah Chen", "Yes, a chart showing the exponential growth in API calls over the last 6 months would be perfect."),
        ("Dev Kapoor", "I'll generate the API request volume chart and export it as a high-res PNG for the deck."),
        ("Tom Okoro", "I also need to write the narrative summary for the slides. It needs to tell a compelling story of where the product goes in the next 3 years."),
        ("Sarah Chen", "Make sure the future roadmap section mentions our planned integration hub. Investors love expansion potential."),
        ("Tom Okoro", "I'll write the roadmap description and slide copy by tomorrow."),
        ("Dev Kapoor", "I'll get the API statistics chart done by Friday morning."),
        ("Sarah Chen", "Let's review action items. Tom has the narrative. Dev has the charts. I have valuation research."),
        ("Tom Okoro", "We'll aggregate everything into the main pitch deck folder by Friday afternoon."),
        ("Sarah Chen", "Perfect. Let's meet again on Monday for a dry run. Thanks guys!"),
        ("Dev Kapoor", "Sounds good, see you Monday. Bye!"),
        ("Tom Okoro", "Bye, have a good weekend!")
    ]

    m5_times = gen_timestamps(len(m5_dialogue), 5.0)
    for i, (sp, txt) in enumerate(m5_dialogue):
        db.add(models.Transcript(
            meeting_id=m5.id,
            speaker=sp,
            text=txt,
            start_time=m5_times[i][0],
            end_time=m5_times[i][1],
            sequence=i + 1
        ))

    db.add(models.Summary(
        meeting_id=m5.id,
        overview="Preparation for Series A investor presentation. The team reviewed MRR growth metrics, GTM scalability, competition analysis, and valuation benchmarks.",
        key_topics=json.dumps(["Pitch Deck", "Traction Metrics", "Valuation", "Go-to-Market", "Competitive Landscape"]),
        outline=json.dumps([
            {"title": "MRR Traction & Growth Metrics", "start_time": 5.0},
            {"title": "Tech Scalability & Competition Matrix", "start_time": 200.0},
            {"title": "Valuation Targets & Action Plan", "start_time": 450.0}
        ])
    ))

    m5_actions = [
        models.ActionItem(meeting_id=m5.id, text="Research valuation comparables and competitor funding histories", assignee="Sarah Chen", due_date="2026-08-16", completed=False),
        models.ActionItem(meeting_id=m5.id, text="Generate customer API request volume growth chart for the deck", assignee="Dev Kapoor", due_date="2026-08-15", completed=True),
        models.ActionItem(meeting_id=m5.id, text="Draft the 3-year vision roadmap and product integration summary", assignee="Tom Okoro", due_date="2026-08-16", completed=False),
        models.ActionItem(meeting_id=m5.id, text="Organize a dry run rehearsal for the investor pitch on Monday", assignee="Sarah Chen", due_date="2026-08-17", completed=False)
    ]
    for action in m5_actions:
        db.add(action)

    db.commit()
    print("Database successfully seeded with 5 meetings!")
    db.close()

if __name__ == "__main__":
    seed_database()

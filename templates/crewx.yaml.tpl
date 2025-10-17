# CrewX Quickstart Configuration
# -------------------------------------------
# This file defines your custom CrewX agents.
# It lives next to your project source so the CLI can discover it automatically.
# Edit the sections below to tweak the default behaviour.

settings:
  slack:
    # Set to false if you do not want CrewX to store channel history locally.
    log_conversations: true

# Optional project-wide documents. Reference them inside agents.inline.documents.
documents:
  onboarding-notes: |
    Replace this block with links or docs that every agent should know.
    You can add Markdown content here. It will be piped to the model
    whenever quickstart agents are invoked.

# Custom agents powered by CrewX.
agents:
  - id: quickstart
    name: "Quickstart Assistant"
    provider: "cli/claude"
    description: "Friendly assistant configured by the CrewX quickstart scaffold."
    capabilities:
      - query          # read-only operations (default)
      - implementation # allow execute mode when you are ready
    inline:
      model: "haiku"
      system_prompt: |
        You are the Quickstart assistant for the project "{{PROJECT_NAME}}".
        Provide concise, actionable help. Ask clarifying questions before
        editing files. Summarise every plan in bullet points.

        <documents>
        <document name="onboarding-notes">
        {{{documents.onboarding-notes.content}}}
        </document>
        <documents>
        
        <messages>
        {{{formatConversation messages platform}}}
        </messages>